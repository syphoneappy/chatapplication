"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

# import os

# from django.core.asgi import get_asgi_application

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# application = get_asgi_application()


# import os

# from django.core.asgi import get_asgi_application
# from channels.routing import ProtocolTypeRouter

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# application = ProtocolTypeRouter({
#     'http': get_asgi_application()
# })


# asgi.py

import os
import django
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import chats.routing  # Import your routing configuration

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

django.setup()

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AuthMiddlewareStack(
            URLRouter(
                chats.routing.websocket_urlpatterns
            )
        ),
    }
)


