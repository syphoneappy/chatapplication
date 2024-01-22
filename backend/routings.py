# from channels.routing import ProtocolTypeRouter, URLRouter
# from django.urls import path
# from chats.consumers import ChatConsumer
# application = ProtocolTypeRouter({
#     'websocket': URLRouter([
#         # path('ws/chat/', ChatConsumer.as_asgi()),
#     ])
# })

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

from chats.routing import websocket_urlpatterns
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

application = ProtocolTypeRouter({
    "websocket": URLRouter(
        websocket_urlpatterns
    ),
})