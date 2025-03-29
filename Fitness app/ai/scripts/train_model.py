import os
import sys
import torch
import numpy as np
import cv2
import pandas as pd
import argparse
import yaml
import json
import logging
from pathlib import Path
import matplotlib.pyplot as plt
from typing import Dict, List, Tuple, Optional, Union, Any
from tqdm import tqdm
import pytorch_lightning as pl
from pytorch_lightning.loggers import TensorBoardLogger
from pytorch_lightning.callbacks import ModelCheckpoint, EarlyStopping, LearningRateMonitor
from torch.utils.data import Dataset, DataLoader, random_split
import mediapipe as mp
import albumentations as A
from albumentations.pytorch import ToTensorV2

# Add parent directory to path to import local modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from model.feedbacK_model import WorkoutFeedbackTransformer
from model.food_recognition import AdvancedWorkoutFeedback

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("training.log")
    ]
)
logger = logging.getLogger(__name__)

class WorkoutDataset(Dataset):
    """Dataset for workout videos with pose and feedback annotations"""
    
    def __init__(
        self, 
        data_root: str,
        annotations_file: str,
        transform=None,
        max_frames: int = 300,
        frame_sample_rate: int = 3,
        mode: str = 'train'
    ):
        """
        Initialize workout dataset
        
        Args:
            data_root: Directory containing workout video files
            annotations_file: Path to CSV with annotations
            transform: Transforms to apply to video frames
            max_frames: Maximum number of frames to use per video
            frame_sample_rate: Sample every nth frame
            mode: 'train' or 'val' or 'test'
        """
        self.data_root = Path(data_root)
        self.annotations = pd.read_csv(annotations_file)
        self.transform = transform
        self.max_frames = max_frames
        self.frame_sample_rate = frame_sample_rate
        self.mode = mode
        
        # Initialize MediaPipe pose estimator
        self.mp_pose = mp.solutions.pose.Pose(
            static_image_mode=True,
            model_complexity=2,
            enable_segmentation=True,
            min_detection_confidence=0.5
        )
        
        # Validate dataset
        self._validate_dataset()
        logger.info(f"Initialized {mode} dataset with {len(self.annotations)} samples")
        
    def _validate_dataset(self):
        """Validate that all video files exist"""
        missing_files = []
        for _, row in self.annotations.iterrows():
            video_path = self.data_root / row['video_file']
            if not video_path.exists():
                missing_files.append(str(video_path))
        
        if missing_files:
            logger.warning(f"Found {len(missing_files)} missing video files")
            if len(missing_files) <= 5:
                logger.warning(f"Missing files: {missing_files}")
    
    def __len__(self):
        return len(self.annotations)
    
    def __getitem__(self, idx):
        """Get a training sample by index"""
        row = self.annotations.iloc[idx]
        video_path = str(self.data_root / row['video_file'])
        exercise_type = row['exercise_type']
        target_muscles = row['target_muscles'].split(',') if isinstance(row['target_muscles'], str) else []
        quality_score = float(row['quality_score'])
        risk_level = int(row['risk_level'])
        feedback = row['feedback']
        
        # Process video frames and extract poses
        frames, pose_data = self._process_video(video_path)
        
        # Convert target data
        target_quality = torch.tensor([quality_score], dtype=torch.float32)
        target_risk = torch.tensor(risk_level, dtype=torch.long)
        
        return {
            'video_frames': frames,
            'pose_sequence': pose_data,
            'exercise_type': exercise_type,
            'target_muscles': target_muscles,
            'target_quality': target_quality,
            'target_risk': target_risk,
            'feedback': feedback,
            'video_path': video_path
        }
    
    def _process_video(self, video_path):
        """Process video frames and extract pose data"""
        cap = cv2.VideoCapture(video_path)
        frames = []
        pose_data = []
        frame_idx = 0
        
        while cap.isOpened() and len(frames) < self.max_frames:
            success, frame = cap.read()
            if not success:
                break
            
            # Process every nth frame
            if frame_idx % self.frame_sample_rate == 0:
                # Resize and convert to RGB
                frame = cv2.resize(frame, (224, 224))
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                
                # Apply transforms if available
                if self.transform:
                    transformed = self.transform(image=frame_rgb)
                    frame_rgb = transformed["image"]
                
                # Extract pose landmarks
                results = self.mp_pose.process(frame_rgb)
                
                if results.pose_landmarks:
                    # Extract landmarks as numpy array
                    landmarks = np.array([[lm.x, lm.y, lm.z] for lm in results.pose_landmarks.landmark])
                    
                    # Add to collections
                    if isinstance(frame_rgb, np.ndarray):
                        frame_tensor = torch.from_numpy(frame_rgb).permute(2, 0, 1).float() / 255.0
                        frames.append(frame_tensor)
                    else:
                        frames.append(frame_rgb)  # Already a tensor
                    
                    pose_data.append(torch.from_numpy(landmarks).float())
            
            frame_idx += 1
        
        cap.release()
        
        # Handle empty frames case
        if len(frames) == 0:
            # Create dummy data
            frames = [torch.zeros(3, 224, 224)]
            pose_data = [torch.zeros(33, 3)]  # MediaPipe has 33 landmarks
            logger.warning(f"No valid frames extracted from {video_path}")
        
        # Stack frames and pose data
        frames_tensor = torch.stack(frames)
        pose_tensor = torch.stack(pose_data)
        
        return frames_tensor, pose_tensor

class FoodDataset(Dataset):
    """Dataset for food image recognition training"""
    
    def __init__(
        self, 
        data_root: str,
        annotations_file: str,
        transform=None,
        mode: str = 'train'
    ):
        """
        Initialize food dataset
        
        Args:
            data_root: Directory containing food images
            annotations_file: Path to CSV with annotations
            transform: Transforms to apply to images
            mode: 'train' or 'val' or 'test'
        """
        self.data_root = Path(data_root)
        self.annotations = pd.read_csv(annotations_file)
        self.transform = transform
        self.mode = mode
        
        # Validate dataset
        self._validate_dataset()
        logger.info(f"Initialized {mode} dataset with {len(self.annotations)} samples")
    
    def _validate_dataset(self):
        """Validate that all image files exist"""
        missing_files = []
        for _, row in self.annotations.iterrows():
            image_path = self.data_root / row['image_file']
            if not image_path.exists():
                missing_files.append(str(image_path))
        
        if missing_files:
            logger.warning(f"Found {len(missing_files)} missing image files")
            if len(missing_files) <= 5:
                logger.warning(f"Missing files: {missing_files}")
    
    def __len__(self):
        return len(self.annotations)
    
    def __getitem__(self, idx):
        """Get a training sample by index"""
        row = self.annotations.iloc[idx]
        image_path = str(self.data_root / row['image_file'])
        food_name = row['food_name']
        calories = float(row['calories'])
        protein = float(row['protein'])
        carbs = float(row['carbs'])
        fat = float(row['fat'])
        
        # Load and process image
        image = cv2.imread(image_path)
        if image is None:
            logger.error(f"Failed to load image: {image_path}")
            image = np.zeros((224, 224, 3), dtype=np.uint8)
        
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        if self.transform:
            transformed = self.transform(image=image)
            image = transformed["image"]
        
        # Create nutrition tensor
        nutrition = torch.tensor([calories, protein, carbs, fat], dtype=torch.float32)
        
        return {
            'image': image,
            'food_name': food_name,
            'nutrition': nutrition,
            'image_path': image_path
        }

def get_transforms(mode: str):
    """Get image transforms for different modes"""
    if mode == 'train':
        return A.Compose([
            A.RandomResizedCrop(224, 224, scale=(0.8, 1.0)),
            A.HorizontalFlip(p=0.5),
            A.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2, hue=0.05, p=0.5),
            A.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
            ToTensorV2()
        ])
    else:  # val/test
        return A.Compose([
            A.Resize(256, 256),
            A.CenterCrop(224, 224),
            A.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
            ToTensorV2()
        ])

def create_dataloaders(config: Dict[str, Any], dataset_type: str):
    """Create train, validation, and test dataloaders"""
    if dataset_type == 'workout':
        # Set up transforms for workout dataset
        train_transform = get_transforms('train')
        val_transform = get_transforms('val')
        
        # Create datasets
        train_dataset = WorkoutDataset(
            data_root=config['workout_data_path'],
            annotations_file=config['workout_train_annotations'],
            transform=train_transform,
            mode='train',
            max_frames=config['max_frames'],
            frame_sample_rate=config['frame_sample_rate']
        )
        
        val_dataset = WorkoutDataset(
            data_root=config['workout_data_path'],
            annotations_file=config['workout_val_annotations'],
            transform=val_transform,
            mode='val',
            max_frames=config['max_frames'],
            frame_sample_rate=config['frame_sample_rate']
        )
        
        test_dataset = WorkoutDataset(
            data_root=config['workout_data_path'],
            annotations_file=config['workout_test_annotations'],
            transform=val_transform,
            mode='test',
            max_frames=config['max_frames'],
            frame_sample_rate=config['frame_sample_rate']
        )
        
    elif dataset_type == 'food':
        # Set up transforms for food dataset
        train_transform = get_transforms('train')
        val_transform = get_transforms('val')
        
        # Create datasets
        train_dataset = FoodDataset(
            data_root=config['food_data_path'],
            annotations_file=config['food_train_annotations'],
            transform=train_transform,
            mode='train'
        )
        
        val_dataset = FoodDataset(
            data_root=config['food_data_path'],
            annotations_file=config['food_val_annotations'],
            transform=val_transform,
            mode='val'
        )
        
        test_dataset = FoodDataset(
            data_root=config['food_data_path'],
            annotations_file=config['food_test_annotations'],
            transform=val_transform,
            mode='test'
        )
    
    else:
        raise ValueError(f"Unknown dataset type: {dataset_type}")
    
    # Create data loaders
    train_loader = DataLoader(
        train_dataset,
        batch_size=config['batch_size'],
        shuffle=True,
        num_workers=config['num_workers'],
        pin_memory=True
    )
    
    val_loader = DataLoader(
        val_dataset,
        batch_size=config['batch_size'],
        shuffle=False,
        num_workers=config['num_workers'],
        pin_memory=True
    )
    
    test_loader = DataLoader(
        test_dataset,
        batch_size=config['batch_size'],
        shuffle=False,
        num_workers=config['num_workers'],
        pin_memory=True
    )
    
    return train_loader, val_loader, test_loader

def create_callbacks(config: Dict[str, Any], model_name: str):
    """Create training callbacks"""
    checkpoint_callback = ModelCheckpoint(
        dirpath=os.path.join(config['output_dir'], model_name),
        filename=f'{model_name}-{{epoch:02d}}-{{val_loss:.4f}}',
        save_top_k=3,
        verbose=True,
        monitor='val_loss',
        mode='min',
        save_last=True
    )
    
    early_stopping = EarlyStopping(
        monitor='val_loss',
        patience=config['patience'],
        verbose=True,
        mode='min'
    )
    
    lr_monitor = LearningRateMonitor(logging_interval='epoch')
    
    return [checkpoint_callback, early_stopping, lr_monitor]

def train_workout_feedback_model(config: Dict[str, Any]):
    """Train workout feedback transformer model"""
    logger.info("Starting workout feedback model training")
    
    # Create dataloaders
    train_loader, val_loader, test_loader = create_dataloaders(config, 'workout')
    
    # Initialize model
    model = WorkoutFeedbackTransformer(
        base_model=config['workout_model']['base_model'],
        vision_model=config['workout_model']['vision_model'],
        num_poses=33,  # MediaPipe has 33 pose landmarks
        hidden_dim=config['workout_model']['hidden_dim'],
        num_layers=config['workout_model']['num_layers'],
        num_heads=config['workout_model']['num_heads'],
        dropout=config['workout_model']['dropout'],
        learning_rate=config['workout_model']['learning_rate']
    )
    
    # Create logger and callbacks
    tb_logger = TensorBoardLogger(os.path.join(config['log_dir'], "workout_feedback"))
    callbacks = create_callbacks(config, "workout_feedback")
    
    # Initialize trainer
    trainer = pl.Trainer(
        max_epochs=config['workout_model']['epochs'],
        callbacks=callbacks,
        logger=tb_logger,
        accelerator='auto',  # Automatically choose available accelerator
        devices='auto',      # Use available devices
        log_every_n_steps=10,
        deterministic=config['deterministic']
    )
    
    # Train model
    trainer.fit(model, train_loader, val_loader)
    
    # Test model
    test_results = trainer.test(model, test_loader)
    
    # Save final model
    final_model_path = os.path.join(config['output_dir'], "workout_feedback", "final_model.pt")
    trainer.save_checkpoint(final_model_path)
    
    # Save test results
    test_results_path = os.path.join(config['output_dir'], "workout_feedback", "test_results.json")
    with open(test_results_path, 'w') as f:
        json.dump(test_results, f)
    
    logger.info(f"Workout feedback model training completed. Results: {test_results}")
    
    return model, test_results

def train_food_recognition_model(config: Dict[str, Any]):
    """Train food recognition model"""
    logger.info("Starting food recognition model training")
    
    # Create dataloaders
    train_loader, val_loader, test_loader = create_dataloaders(config, 'food')
    
    # Initialize model
    model = AdvancedWorkoutFeedback(
        text_model_name=config['food_model']['text_model_name'],
        vision_model_name=config['food_model']['vision_model_name'],
        lr=config['food_model']['learning_rate']
    )
    
    # Create logger and callbacks
    tb_logger = TensorBoardLogger(os.path.join(config['log_dir'], "food_recognition"))
    callbacks = create_callbacks(config, "food_recognition")
    
    # Initialize trainer
    trainer = pl.Trainer(
        max_epochs=config['food_model']['epochs'],
        callbacks=callbacks,
        logger=tb_logger,
        accelerator='auto',
        devices='auto',
        log_every_n_steps=10,
        deterministic=config['deterministic']
    )
    
    # Train model
    trainer.fit(model, train_loader, val_loader)
    
    # Test model
    test_results = trainer.test(model, test_loader)
    
    # Save final model
    final_model_path = os.path.join(config['output_dir'], "food_recognition", "final_model.pt")
    trainer.save_checkpoint(final_model_path)
    
    # Save test results
    test_results_path = os.path.join(config['output_dir'], "food_recognition", "test_results.json")
    with open(test_results_path, 'w') as f:
        json.dump(test_results, f)
    
    logger.info(f"Food recognition model training completed. Results: {test_results}")
    
    return model, test_results

def load_config(config_path: str) -> Dict[str, Any]:
    """Load configuration from YAML file"""
    with open(config_path, 'r') as f:
        config = yaml.safe_load(f)
    
    # Create output directories if they don't exist
    os.makedirs(config['output_dir'], exist_ok=True)
    os.makedirs(config['log_dir'], exist_ok=True)
    os.makedirs(os.path.join(config['output_dir'], "workout_feedback"), exist_ok=True)
    os.makedirs(os.path.join(config['output_dir'], "food_recognition"), exist_ok=True)
    
    return config

def setup_parser() -> argparse.ArgumentParser:
    """Set up command line argument parser"""
    parser = argparse.ArgumentParser(description='Train fitness app AI models')
    
    parser.add_argument(
        '--config',
        type=str,
        required=True,
        help='Path to YAML configuration file'
    )
    
    parser.add_argument(
        '--model',
        type=str,
        choices=['workout', 'food', 'all'],
        default='all',
        help='Which model to train (workout, food, or all)'
    )
    
    parser.add_argument(
        '--debug',
        action='store_true',
        help='Enable debug mode with limited data and epochs'
    )
    
    return parser

if __name__ == "__main__":
    # Parse command line arguments
    parser = setup_parser()
    args = parser.parse_args()
    
    # Load configuration
    config = load_config(args.config)
    
    # Apply debug mode if enabled
    if args.debug:
        logger.info("Running in debug mode with reduced dataset and epochs")
        config['batch_size'] = 2
        config['workout_model']['epochs'] = 2
        config['food_model']['epochs'] = 2
        config['num_workers'] = 0
    
    # Set random seed for reproducibility
    pl.seed_everything(config['seed'], workers=True)
    
    # Train selected model(s)
    if args.model in ['workout', 'all']:
        train_workout_feedback_model(config)
    
    if args.model in ['food', 'all']:
        train_food_recognition_model(config)
    
    logger.info("Training complete!")
