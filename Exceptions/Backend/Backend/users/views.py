from django.shortcuts import redirect, render, HttpResponse
from django.contrib import messages
from .models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from .forms import LoginForm, RegisterForm, LoginForm
from django.utils.timezone import now
from datetime import timedelta
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .serializers import UserSerializer


def LoginView(request):
    if request.method == 'GET':
        form = LoginForm()
        return render(request, 'users/login.html', {'form': form})

    elif request.method == 'POST':
        form = LoginForm(request.POST)
        
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)

            if user:
                login(request, user)

                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)
                refresh_token = str(refresh)

                response = redirect('http://localhost:5173/safereturn/items') 
                response.set_cookie(
                    key='access_token',
                    value=access_token,
                    httponly=False,  # Allow JavaScript access
                    secure=False,    # testing
                    samesite='Lax',
                    expires=now() + timedelta(minutes=5)
                )
                response.set_cookie(
                    key='refresh_token',
                    value=refresh_token,
                    httponly=True,   
                    secure=False,    # testing
                    samesite='Lax',
                    expires=now() + timedelta(days=7)
                )

                messages.success(request, f'Welcome back, {username.title()}!')
                return response

            messages.error(request, 'Invalid username or password')

        return render(request, 'users/login.html', {'form': form})


        # if request.method == 'GET':
        #     if request.user.is_authenticated:
        #         return redirect('posts')
            
        #     form = LoginForm()
        #     return render(request,'users/login.html', {'form': form})
        
        # elif request.method == 'POST':
        #     form = LoginForm(request.POST)
            
        #     if form.is_valid():
        #         username = form.cleaned_data['username']
        #         password=form.cleaned_data['password']
        #         user = authenticate(request,username=username,password=password)
        #         if user:
        #             login(request, user)
        #             messages.success(request,f'Hi {username.title()}, welcome back!')
        #             return redirect('item-list')
            
        #     # either form not valid or user is not authenticated
        #     messages.error(request,f'Invalid username or password')
        #     return render(request,'users/login.html',{'form': form})



def SignupView(request):
    if request.method == 'GET':
        form = RegisterForm()
        return render(request, 'users/register.html', {'form': form})
    
    if request.method == 'POST':
        form = RegisterForm(request.POST) 
        if form.is_valid():
            user = form.save(commit=False)
            user.username = user.username.lower()
            user.save()

            messages.success(request, 'You have signed up successfully! Please log in.')
            return redirect('login')  
        
        else:
            return render(request, 'users/register.html', {'form': form})


# def LogoutView(request):
#     logout(request)
#     messages.success(request,f'You have been logged out.')
#     return redirect('login')  
def LogoutView(request):
    response = redirect('login')
    response.delete_cookie('access_token')
    response.delete_cookie('refresh_token')
    logout(request)
    messages.success(request, 'You have been logged out.')
    return response


class RegisterView(generics.CreateAPIView):
    """
    API endpoint for user registration
    """
    serializer_class = UserSerializer
    permission_classes = []

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': serializer.data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

class UserProfileView(generics.RetrieveAPIView):
    """
    API endpoint to get user profile
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class UserProfileUpdateView(generics.UpdateAPIView):
    """
    API endpoint to update user profile
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

