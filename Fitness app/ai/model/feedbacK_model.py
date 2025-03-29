import torch
import torch.nn as nn
import transformers
from transformers import T5Tokenizer, T5ForConditionalGeneration
import timm
import mediapipe as mp
import cv2
from einops import rearrange
import pytorch_lightning as pl

class AdvancedWorkoutFeedbackModel(pl.LightningModule):

    def __init__(
        self,
        base_model: str = "t5-base",
        vision_model: str = "vit_base_patch16_224",
        lr: float = 1e-4
    ):
        super().__init__()
        self.save_hyperparameters()

        # Vision backbone
        self.vision_encoder = timm.create_model(
            vision_model, pretrained=True, num_classes=0, global_pool=''
        )
        
        # Pose estimator
        self.pose_estimator = mp.solutions.pose.Pose(
            static_image_mode=False, model_complexity=2, enable_segmentation=True
        )
        
        # Language model
        self.tokenizer = T5Tokenizer.from_pretrained(base_model)
        self.feedback_generator = T5ForConditionalGeneration.from_pretrained(base_model)

        # Fusion layer
        self.fusion = nn.Sequential(
            nn.Linear(768*3, 768),
            nn.ReLU(),
            nn.Dropout(0.1),
            nn.Linear(768, 768)
        )

        # Classification heads
        self.form_quality_head = nn.Linear(768, 1)
        self.injury_risk_head = nn.Linear(768, 3)

        self.lr = lr

    def forward(self, video_frames, pose_data, exercise_type, previous_feedback=None):

        # Encode frames
        visual_feats = self.vision_encoder(video_frames)
        visual_feats = rearrange(visual_feats, 'b c -> b 1 c')
        
        # Fuse with pose data
        fused_input = torch.cat([visual_feats, pose_data], dim=1)
        fused_output = self.fusion(fused_input.flatten(start_dim=1))

        # Form & Risk
        form_score = torch.sigmoid(self.form_quality_head(fused_output))
        risk_pred = self.injury_risk_head(fused_output)

        # Generate textual feedback
        prompt = self._build_prompt(exercise_type, form_score, risk_pred, previous_feedback)
        tokens = self.tokenizer(prompt, return_tensors="pt", truncation=True, padding=True).to(self.device)
        feedback_ids = self.feedback_generator.generate(tokens.input_ids, max_length=80, num_beams=4)
        feedback_text = self.tokenizer.batch_decode(feedback_ids, skip_special_tokens=True)

        return {"form_score": form_score, "risk_pred": risk_pred, "feedback": feedback_text}

    def _build_prompt(self, exercise_type, form_score, risk_pred, prev_feedback):
        risk_levels = ["Low", "Medium", "High"]
        risk_label = risk_levels[risk_pred.argmax(dim=-1)]
        prompt = f"Exercise: {exercise_type}\nForm: {form_score.item():.2f}\nRisk: {risk_label}\nPrev: {prev_feedback}\nFeedback:"
        return prompt

    def process_frame(self, frame):
        results = self.pose_estimator.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        if not results.pose_landmarks:
            return None
        # Return pose data as torch tensor
        return torch.tensor([[lm.x, lm.y, lm.z] for lm in results.pose_landmarks.landmark]).unsqueeze(0)

    def configure_optimizers(self):
        optimizer = torch.optim.AdamW(self.parameters(), lr=self.lr)
        scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, factor=0.5, patience=3)
        return {"optimizer": optimizer, "lr_scheduler": scheduler, "monitor": "val_loss"}

    def training_step(self, batch, batch_idx):
        outputs = self(
            video_frames=batch["video_frames"],
            pose_data=batch["pose_data"],
            exercise_type=batch["exercise_type"]
        )
        # Sample loss
        risk_loss = nn.CrossEntropyLoss()(outputs["risk_pred"], batch["risk_label"])
        form_loss = nn.MSELoss()(outputs["form_score"], batch["target_form"])
        total_loss = risk_loss + form_loss
        self.log("train_loss", total_loss)
        return total_loss

    @torch.no_grad()
    def real_time_feedback(self, frames, exercise_type, update_interval=30):
        buffer = []
        prev_feedback = None
        for i, frame in enumerate(frames):
            pose_feats = self.process_frame(frame)
            if pose_feats is not None:
                buffer.append(pose_feats)
            if i % update_interval == 0 and buffer:
                stacked_poses = torch.cat(buffer, dim=0).mean(dim=0, keepdim=True)
                dummy_video = torch.randn(1, 3, 224, 224).to(self.device)  # Placeholder
                result = self(dummy_video, stacked_poses, exercise_type, prev_feedback)
                prev_feedback = result["feedback"][0]
                yield {"feedback": prev_feedback, "form_score": result["form_score"].item()}
                buffer.clear()
