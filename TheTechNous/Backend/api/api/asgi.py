"""
ASGI config for api project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""


import os
import django
from django.core.asgi import get_asgi_application
from django.urls import path

from channels.routing import get_default_application, ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.layers import get_channel_layer

from api.api import views

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'api.settings')
django.setup()


application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AuthMiddlewareStack(
            URLRouter(
                [
                    path("ws/some_path/", views.SomeConsumer.as_asgi()),
                    path("ws/notifications/", views.NotificationConsumer.as_asgi()),  # Pddee
                ]
            )
        ),
    }
)

channel_layer = get_channel_layer()
