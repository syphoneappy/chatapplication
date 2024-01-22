import json
from channels.generic.websocket import AsyncWebsocketConsumer
from urllib.parse import unquote
import base64
import re
from chatlogin.models import CustomUser
from .models import ChatMessage
from channels.db import database_sync_to_async
class SimpleConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']

        sanitized_room_name = re.sub(r'[^a-zA-Z0-9\-_\.]', '', self.room_name)
        self.room_group_name = f"chat{sanitized_room_name}"
        print(self.room_group_name)

        # print(f"Raw Room Name: {self.room_name}")


        # self.room_group_name = f"chat{self.room_name}"

        # print(f"Room Group Name: {self.room_group_name}")


        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        ),

        await self.accept()



    async def disconnect(self, close_code):

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    @database_sync_to_async
    def get_user_instance(self, username):
        return CustomUser.objects.get(username=username)
    
    @database_sync_to_async
    def save_chat_message(self, sender, receiver, content):
        return ChatMessage.objects.create(sender=sender, receiver=receiver, content=content)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        to_user = text_data_json.get('to')
        current_user = text_data_json["username"]

        sender = await self.get_user_instance(current_user)
        receiver = await self.get_user_instance(to_user) if to_user else None

        await self.save_chat_message(sender, receiver, message)

        if to_user:
            room_name = f"chat{min(current_user, to_user)}{max(current_user, to_user)}"
            print(room_name)
        else:
            room_name = f"chat{str(current_user[:4])}{str(to_user[:4])}"
            print(room_name)

  
        await self.channel_layer.group_send(
            room_name,
            {
                'type': 'chat.message',
                'message': message,
                'username': current_user,
            }
        )


    async def chat_message(self, event):
        message = event['message']
        username = event['username']

        await self.send(text_data=json.dumps({
            'message': message,
            'username': username,
        }))
