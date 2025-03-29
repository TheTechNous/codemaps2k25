import torch
import torch.nn as nn
import pytorch_lightning as pl
import timm
import mediapipe as mp
import cv2
from einops import rearrange
from transformers import T5Tokenizer, T5ForConditionalGeneration

class AdvancedWorkoutFeedback(pl.LightningModule):
    def __init__(
        self,
        text_model_name: str = "t5-base",
        vision_model_name: str = "vit_base_patch16_224",
        lr: float = 1e-4
    ):
        super().__init__()
        self.save_hyperparameters()
        
        # Pose estimator
        self.pose_estimator = mp.solutions.pose.Pose(
            static_image_mode=False, model_complexity=2, enable_segmentation=True
        )
        
        # Vision encoder
        self.vision_encoder = timm.create_model(
            vision_model_name, pretrained=True, num_classes=0, global_pool=''
        )
        
        # Text generator
        self.tokenizer = T5Tokenizer.from_pretrained(text_model_name)
        self.feedback_generator = T5ForConditionalGeneration.from_pretrained(text_model_name)

        # Fusion & heads
        self.fusion = nn.Sequential(
            nn.Linear(768*3, 768),
            nn.GELU(),
            nn.Dropout(0.1),
            nn.Linear(768, 768)
        )
        self.form_head = nn.Linear(768, 1)
        self.risk_head = nn.Linear(768, 3)
        
        self.lr = lr

    def forward(self, frames, pose_data, exercise_type, past_feedback=None):
        # Encode frames
        vision_feats = self.vision_encoder(frames)
        vision_feats = rearrange(vision_feats, 'b c -> b 1 c')

        # Fuse with pose
        fused_input = torch.cat([vision_feats, pose_data], dim=1)
        fused_output = self.fusion(fused_input.flatten(start_dim=1))

        form_score = torch.sigmoid(self.form_head(fused_output))
        risk_logit = self.risk_head(fused_output)
        
        prompt = self._build_prompt(exercise_type, form_score, risk_logit, past_feedback)
        tokens = self.tokenizer(prompt, return_tensors="pt", truncation=True).to(self.device)
        out_ids = self.feedback_generator.generate(tokens.input_ids, max_length=80, num_beams=4)
        feedback = self.tokenizer.batch_decode(out_ids, skip_special_tokens=True)

        return {"form_score": form_score, "risk": risk_logit, "feedback": feedback}

    def _build_prompt(self, exercise_type, form_score, risk_logit, past_feedback):
        risk_levels = ["Low", "Medium", "High"]
        risk_str = risk_levels[risk_logit.argmax(dim=-1)]
        prompt = f"{exercise_type}, form={form_score.item():.2f}, risk={risk_str}, prev={past_feedback}\nFeedback:"
        return prompt

    def process_frame(self, frame):
        result = self.pose_estimator.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        if result.pose_landmarks:
            pts = [[lm.x, lm.y, lm.z] for lm in result.pose_landmarks.landmark]
            return torch.tensor(pts).unsqueeze(0)
        return None

    def training_step(self, batch, _):
        outputs = self(
            frames=batch["frames"],
            pose_data=batch["pose_data"],
            exercise_type=batch["exercise_type"]
        )
        risk_loss = nn.CrossEntropyLoss()(outputs["risk"], batch["risk_label"])
        form_loss = nn.MSELoss()(outputs["form_score"], batch["form_label"])
        total_loss = risk_loss + form_loss
        self.log("train_loss", total_loss)
        return total_loss

    def configure_optimizers(self):
        optimizer = torch.optim.AdamW(self.parameters(), lr=self.lr)
        scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, factor=0.5, patience=3)
        return {"optimizer": optimizer, "lr_scheduler": scheduler, "monitor": "train_loss"}
    
    @torch.no_grad()
    def real_time_feedback(self, frames, exercise_type):
        buffer = []
        past = None
        for i, frame in enumerate(frames):
            pose = self.process_frame(frame)
            if pose is not None:
                buffer.append(pose)
            if i % 30 == 0 and buffer:
                pose_batch = torch.cat(buffer, dim=0).mean(dim=0).unsqueeze(0)
                fake_frame = torch.randn(1, 3, 224, 224).to(self.device)
                result = self(fake_frame, pose_batch, exercise_type, past)
                past = result["feedback"][0]
                buffer.clear()
                yield {"feedback": past, "form_score": result["form_score"].item()}
