from django import forms
from .models import User
from django.contrib.auth.forms import UserCreationForm

class LoginForm(forms.Form):
    username = forms.CharField(
        required=True,
        error_messages={'required': 'Please enter your username'}
    )
    password = forms.CharField(
        widget=forms.PasswordInput,
        required=True,
        error_messages={'required': 'Please enter your password'}
    )


class RegisterForm(UserCreationForm):
    ROLE_CHOICES = [
        ('user', 'User'),
        ('faculty', 'Faculty'),
    ]

    class Meta:
        model = User
        fields = ['username', 'email', 'phone_number', 'role', 'unique_id', 'password1', 'password2']

    username = forms.CharField(
        required=True,
        error_messages={'required': 'Please enter your username'}
    )
    email = forms.EmailField(
        required=True,
        error_messages={'required': 'Please enter your email'}
    )
    phone_number = forms.CharField(
        max_length=15,
        required=True,
        error_messages={'required': 'Please enter your phone number'}
    )
    role = forms.ChoiceField(
        choices=ROLE_CHOICES,
        required=True,
        widget=forms.Select,
        error_messages={'required': 'Please select a role'}
    )
    unique_id = forms.CharField(
        required=True,
        error_messages={'required': 'Please enter Unique ID'}
    )
    password1 = forms.CharField(
        widget=forms.PasswordInput,
        required=True,
        error_messages={'required': 'Please enter your password'}
    )
    password2 = forms.CharField(
        widget=forms.PasswordInput,
        required=True,
        error_messages={'required': 'Please confirm your password'}
    )
