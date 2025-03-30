from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = [
        ('user', 'User'),
        ('faculty', 'Faculty'),
    ]
    
    unique_id = models.CharField(unique=True, max_length=12)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    phone_number = models.CharField(max_length=15)
    
    def __str__(self):
        return self.username
