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

        # Send a message to the consumer
        message = {'type': 'chat.message', 'message': 'Hello, world!'}
        await communicator.send_json_to(message)

        # Receive the message from the consumer
        response = await communicator.receive_json_from()
        response = await self.receive_output(timeout=100)

        # Check that the message is received correctly
        self.assertEqual(response, message)

        # Disconnect the communicator
        await communicator.disconnect()
