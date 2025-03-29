import os
import torch
import numpy as np
import cv2
import time
import json
import logging
from typing import Dict, List, Tuple, Optional, Union, Any
from pathlib import Path
import mediapipe as mp

# Import AI models from the project
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from model.feedbacK_model import WorkoutFeedbackTransformer
from model.food_recognition import AdvancedWorkoutFeedback

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('AI_Interface')

class AIInferenceInterface:
    """
    Interface for AI model inference in the fitness application.
    Handles loading models, processing inputs, and returning results.
    """
    
    def __init__(
        self, 
        models_dir: str = "../models",
        device: str = None,
        use_gpu: bool = True
    ):
        """
        Initialize the AI interface with models for workout feedback and food recognition.
        
        Args:
            models_dir: Directory containing model weights
            device: Device to run inference on (auto-detected if None)
            use_gpu: Whether to use GPU acceleration if available
        """
        self.models_dir = Path(models_dir)
        self.device = self._get_device(device, use_gpu)
        logger.info(f"Using device: {self.device}")
        
        # Initialize AI models
        self.models = {}
        self._load_models()
        
        # Initialize MediaPipe solutions
        self.mp_pose = mp.solutions.pose
        self.mp_drawing = mp.solutions.drawing_utils
        
        logger.info("AI Interface initialization complete")
    
    def _get_device(self, device: str, use_gpu: bool) -> torch.device:
        """Determine the appropriate device for inference"""
        if device is not None:
            return torch.device(device)
        
        if use_gpu and torch.cuda.is_available():
            return torch.device('cuda')
        elif use_gpu and torch.backends.mps.is_available():
            return torch.device('mps')  # Apple Silicon GPU
        else:
            return torch.device('cpu')
    
    def _load_models(self) -> None:
        """Load all AI models required by the application"""
        try:
            # Load workout feedback model
            workout_model_path = self.models_dir / "workout_feedback.pt"
            if workout_model_path.exists():
                logger.info("Loading workout feedback model...")
                self.models['workout_feedback'] = WorkoutFeedbackTransformer.load_from_checkpoint(
                    workout_model_path, 
                    map_location=self.device
                )
                self.models['workout_feedback'].eval()
                self.models['workout_feedback'].to(self.device)
            else:
                logger.warning(f"Workout feedback model not found at {workout_model_path}")
            
            # Load food recognition model
            food_model_path = self.models_dir / "food_recognition.pt"
            if food_model_path.exists():
                logger.info("Loading food recognition model...")
                self.models['food_recognition'] = AdvancedWorkoutFeedback.load_from_checkpoint(
                    food_model_path,
                    map_location=self.device
                )
                self.models['food_recognition'].eval()
                self.models['food_recognition'].to(self.device)
            else:
                logger.warning(f"Food recognition model not found at {food_model_path}")
                
        except Exception as e:
            logger.error(f"Error loading models: {str(e)}")
            raise
    
    @torch.no_grad()
    def analyze_workout(
        self, 
        video_path: str, 
        exercise_type: str,
        target_muscles: List[str] = None,
        real_time: bool = False,
        feedback_interval: int = 30
    ) -> Union[Dict[str, Any], object]:
        """
        Analyze workout video for form quality and generate feedback
        
        Args:
            video_path: Path to video file or camera index (int)
            exercise_type: Type of exercise being performed
            target_muscles: Target muscle groups for the exercise
            real_time: If True, returns a generator for real-time feedback
            feedback_interval: Frame interval for feedback in real-time mode
            
        Returns:
            Dict with analysis results or generator for real-time mode
        """
        if 'workout_feedback' not in self.models:
            logger.error("Workout feedback model not loaded")
            return {"error": "Model not available"}
        
        try:
            # For real-time analysis, return a generator
            if real_time:
                if isinstance(video_path, int):
                    return self._real_time_workout_analysis(
                        camera_idx=video_path,
                        exercise_type=exercise_type,
                        target_muscles=target_muscles or [],
                        feedback_interval=feedback_interval
                    )
                else:
                    logger.error("Real-time mode requires camera index, not video path")
                    return {"error": "Invalid input for real-time mode"}
            
            # For video file analysis, process the entire file
            if not os.path.isfile(video_path):
                logger.error(f"Video file not found: {video_path}")
                return {"error": "Video file not found"}
                
            return self._analyze_workout_video(
                video_path=video_path,
                exercise_type=exercise_type,
                target_muscles=target_muscles or []
            )
            
        except Exception as e:
            logger.error(f"Error in workout analysis: {str(e)}")
            return {"error": str(e)}
    
    def _real_time_workout_analysis(
        self,
        camera_idx: int,
        exercise_type: str,
        target_muscles: List[str],
        feedback_interval: int
    ):
        """Generator for real-time workout analysis"""
        try:
            cap = cv2.VideoCapture(camera_idx)
            if not cap.isOpened():
                raise ValueError(f"Could not open camera {camera_idx}")
            
            with self.mp_pose.Pose(
                min_detection_confidence=0.5,
                min_tracking_confidence=0.5,
                model_complexity=1  # Use 1 for real-time, 2 for accuracy
            ) as pose:
                
                frame_buffer = []
                frame_count = 0
                previous_feedback = None
                
                while cap.isOpened():
                    success, frame = cap.read()
                    if not success:
                        break
                    
                    # Process frame with MediaPipe
                    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    results = pose.process(frame_rgb)
                    
                    if results.pose_landmarks:
                        # Extract pose landmarks
                        pose_data = np.array([
                            [lm.x, lm.y, lm.z] for lm in results.pose_landmarks.landmark
                        ])
                        
                        # Add to frame buffer
                        frame_buffer.append(pose_data)
                        
                        # Generate feedback at intervals
                        frame_count += 1
                        if frame_count % feedback_interval == 0:
                            # Prepare input for model
                            pose_tensor = torch.tensor(np.array(frame_buffer), dtype=torch.float32)
                            pose_tensor = pose_tensor.to(self.device)
                            
                            # Get model feedback
                            model_input = {
                                'video_frames': torch.zeros(1, 3, 224, 224).to(self.device),  # Placeholder
                                'pose_sequence': pose_tensor.unsqueeze(0),
                                'exercise_type': exercise_type,
                                'target_muscles': target_muscles,
                                'previous_feedback': previous_feedback
                            }
                            
                            output = self.models['workout_feedback'](**model_input)
                            
                            # Update previous feedback
                            previous_feedback = output["feedback"][0]
                            frame_buffer = []
                            
                            # Draw pose landmarks on frame
                            annotated_frame = frame.copy()
                            self.mp_drawing.draw_landmarks(
                                annotated_frame,
                                results.pose_landmarks,
                                self.mp_pose.POSE_CONNECTIONS
                            )
                            
                            # Yield results
                            yield {
                                'frame': annotated_frame,
                                'feedback': previous_feedback,
                                'quality_score': float(output["quality_score"].cpu().numpy()[0]),
                                'risk_level': torch.argmax(output["risk_assessment"]).item()
                            }
        
        except Exception as e:
            logger.error(f"Error in real-time analysis: {str(e)}")
            yield {"error": str(e)}
        finally:
            if 'cap' in locals():
                cap.release()
    
    def _analyze_workout_video(
        self,
        video_path: str,
        exercise_type: str,
        target_muscles: List[str]
    ) -> Dict[str, Any]:
        """Process a complete workout video file and return analysis"""
        cap = cv2.VideoCapture(video_path)
        
        try:
            if not cap.isOpened():
                raise ValueError(f"Could not open video: {video_path}")
            
            # Get video properties
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            fps = cap.get(cv2.CAP_PROP_FPS)
            
            # Process frames in batches
            frame_samples = []
            pose_data = []
            
            with self.mp_pose.Pose(
                static_image_mode=False,
                model_complexity=2,  # Higher accuracy for offline analysis
                min_detection_confidence=0.5
            ) as pose:
                # Sample frames from the video (every 5th frame)
                sample_rate = 5
                for i in range(0, total_frames, sample_rate):
                    cap.set(cv2.CAP_PROP_POS_FRAMES, i)
                    success, frame = cap.read()
                    
                    if not success:
                        continue
                    
                    # Resize for batch processing
                    frame = cv2.resize(frame, (224, 224))
                    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    
                    # Process with MediaPipe
                    results = pose.process(frame_rgb)
                    
                    if results.pose_landmarks:
                        # Extract landmarks
                        landmarks = np.array([
                            [lm.x, lm.y, lm.z] for lm in results.pose_landmarks.landmark
                        ])
                        
                        # Add to collection
                        frame_samples.append(frame_rgb)
                        pose_data.append(landmarks)
            
            if not pose_data:
                return {"error": "No pose data detected in video"}
            
            # Convert to tensors
            frames_tensor = torch.tensor(np.array(frame_samples), dtype=torch.float32)
            frames_tensor = frames_tensor.permute(0, 3, 1, 2)  # NHWC -> NCHW
            frames_tensor = frames_tensor / 255.0  # Normalize
            
            pose_tensor = torch.tensor(np.array(pose_data), dtype=torch.float32)
            
            # Move to device
            frames_tensor = frames_tensor.to(self.device)
            pose_tensor = pose_tensor.to(self.device)
            
            # Get model predictions
            model_input = {
                'video_frames': frames_tensor,
                'pose_sequence': pose_tensor,
                'exercise_type': exercise_type,
                'target_muscles': target_muscles,
                'previous_feedback': None
            }
            
            output = self.models['workout_feedback'](**model_input)
            
            # Process output
            quality_score = float(output["quality_score"].cpu().numpy()[0])
            risk_assessment = output["risk_assessment"].cpu().numpy()
            risk_level = np.argmax(risk_assessment)
            risk_labels = ["Low", "Medium", "High"]
            
            return {
                "exercise_type": exercise_type,
                "duration_seconds": total_frames / fps,
                "quality_score": quality_score,
                "risk_level": risk_labels[risk_level],
                "feedback": output["feedback"][0],
                "target_muscles": target_muscles,
                "analyzed_frames": len(pose_data)
            }
            
        except Exception as e:
            logger.error(f"Error analyzing workout video: {str(e)}")
            return {"error": str(e)}
        finally:
            cap.release()
    
    @torch.no_grad()
    def recognize_food(self, image_path: str) -> Dict[str, Any]:
        """
        Recognize food items in an image and estimate nutritional content
        
        Args:
            image_path: Path to the food image
            
        Returns:
            Dict with recognized food items and nutritional information
        """
        if 'food_recognition' not in self.models:
            logger.error("Food recognition model not loaded")
            return {"error": "Model not available"}
        
        try:
            if not os.path.isfile(image_path):
                return {"error": "Image file not found"}
            
            # Load and preprocess image
            image = cv2.imread(image_path)
            if image is None:
                return {"error": "Could not read image"}
            
            # Convert and preprocess
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            image = cv2.resize(image, (224, 224))
            image_tensor = torch.tensor(image, dtype=torch.float32)
            image_tensor = image_tensor.permute(2, 0, 1)  # HWC -> CHW
            image_tensor = image_tensor.unsqueeze(0)  # Add batch dimension
            image_tensor = image_tensor / 255.0  # Normalize
            
            # Move to device
            image_tensor = image_tensor.to(self.device)
            
            # Run inference
            # Note: This assumes the food recognition model has been adapted for food recognition
            # In a real implementation, you would have a dedicated model for this task
            prediction = self.models['food_recognition'](image_tensor)
            
            # Process results (placeholder for actual food recognition logic)
            # In reality, you would have a more sophisticated food recognition system
            return {
                "food_items": ["Example Food Item"],
                "nutrition": {
                    "calories": 250,
                    "protein": 15,
                    "carbs": 30,
                    "fat": 10
                },
                "confidence": 0.85
            }
            
        except Exception as e:
            logger.error(f"Error in food recognition: {str(e)}")
            return {"error": str(e)}
    
    def get_model_info(self) -> Dict[str, Dict[str, Any]]:
        """Get information about loaded models"""
        info = {}
        
        for name, model in self.models.items():
            param_count = sum(p.numel() for p in model.parameters())
            info[name] = {
                "parameters": param_count,
                "device": next(model.parameters()).device.type,
                "loaded": True
            }
        
        return info


def main():
    """Test the AI interface with sample inputs"""
    # Initialize interface
    interface = AIInferenceInterface(models_dir="../models")
    
    # Print model information
    print("Model Information:")
    print(json.dumps(interface.get_model_info(), indent=2))
    
    # Test workout analysis (if model exists)
    if 'workout_feedback' in interface.models:
        print("\nTesting workout analysis...")
        result = interface.analyze_workout(
            video_path="../test_data/sample_workout.mp4",
            exercise_type="squat",
            target_muscles=["quadriceps", "glutes", "hamstrings"]
        )
        print(json.dumps(result, indent=2))
    
    # Test food recognition (if model exists)
    if 'food_recognition' in interface.models:
        print("\nTesting food recognition...")
        result = interface.recognize_food("../test_data/sample_food.jpg")
        print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
