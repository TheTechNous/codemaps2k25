"""
URL configuration for main project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from users.views import RegisterView, UserProfileView, UserProfileUpdateView
from items.views import (
    LostItemCreateAPIView,
    FoundItemCreateAPIView,
    ItemListAPIView,
    NonApprovedItemListAPIView,
    ItemDetailAPIView
)
from .views import api_root

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', api_root, name='api-root'),
    path('', include('users.urls')),
    path('api/v1/', include('api.urls')),
    path('api/items/', include('items.urls')),

    path('api/v1/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    
    path('api/v1/register/', RegisterView.as_view(), name='register-1'),
    path('api/v1/profile/', UserProfileView.as_view(), name='user-profile'),
    path('api/v1/profile/update/', UserProfileUpdateView.as_view(), name='user-profile-update'),
    path('api/v1/items/', ItemListAPIView.as_view(), name='item-list'),
    path('api/v1/items/unclaimed/', NonApprovedItemListAPIView.as_view(), name='non-approved-item-list'),
    path('api/v1/items/lost/', LostItemCreateAPIView.as_view(), name='lost-item-create'),
    path('api/v1/items/found/', FoundItemCreateAPIView.as_view(), name='found-item-create'),
    path('api/v1/items/<int:pk>/', ItemDetailAPIView.as_view(), name='item-detail'),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


