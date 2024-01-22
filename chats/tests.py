# chats/tests.py

from channels.testing import WebsocketCommunicator
from django.test import TestCase
from chats.consumers import ChatConsumer
import json

class ChatConsumerTest(TestCase):
    async def test_connect_and_receive_message(self):
        communicator = WebsocketCommunicator(ChatConsumer.as_asgi(), f"/ws/chat/tripathiharsh503@yahoo.in/")
        connected, _ = await communicator.connect()
        self.assertTrue(connected)

        message = {'type': 'chat.message', 'message': 'Hello, world!'}
        await communicator.send_json_to(message)

        response = await communicator.receive_json_from()
        response = await self.receive_output(timeout=100)

        self.assertEqual(response, message)

        await communicator.disconnect()
