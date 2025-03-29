"""
URL configuration for api project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from api.api import views as api_views
from django.contrib.sitemaps import views as sitemap_views
from django.contrib.sitemaps import Sitemap
from app.sitemaps import BlogPostSitemap
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


schema_view = get_schema_view(
    openapi.Info(
        title="API Documentation",
        default_version='v1',
        description="API documentation for the project",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@project.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)


sitemaps = {
    'blog': BlogPostSitemap,
}

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', api_views.index, name='index'),  # Example view from views.py
    path('sitemap.xml', sitemap_views.sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    path('post/<slug:slug>/', api_views.post_detail, name='post_detail'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('roles/', include('app.roles.urls')),  # User roles and permissions management
    path('notifications/', include('app.notifications.urls')),  # Notification system
    path('social/', include('app.social.urls')),  # Social media sharing
    path('media/', include('app.media.urls')),  # File uploads and media management
    path('search/', include('app.search.urls')),  # Advanced search functionality
    path('notification-center/', api_views.NotificationCenterView.as_view(), name='notification_center'),  # Notification center view
]

websocket_urlpatterns = [
    path("ws/some_path/", api_views.SomeConsumer.as_asgi()),
]

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})
