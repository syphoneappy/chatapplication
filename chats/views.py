from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from chatlogin.models import CustomUser
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .models import ChatMessage
from django.db import models
class OtherUsersListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        current_user = self.request.user
        other_users = CustomUser.objects.exclude(id=current_user.id)

        other_users_full_names = [user.username for user in other_users]

        response_data = {
            'other_users_full_names': other_users_full_names,
            'current_user_username': current_user.username,
        }
        return Response(response_data ,status=status.HTTP_200_OK)

from django.shortcuts import render


def simple_chat(request):
    return render(request, 'simple_chat.html')

class MessageHistoryView(APIView):
    def get(self, request, current_user, other_user):
        # Find users based on usernames
        current_user_obj = get_object_or_404(CustomUser, username=current_user)
        other_user_obj = get_object_or_404(CustomUser, username=other_user)

        # Fetch message history between the two users
        messages = ChatMessage.objects.filter(
            (models.Q(sender=current_user_obj) & models.Q(receiver=other_user_obj)) |
            (models.Q(sender=other_user_obj) & models.Q(receiver=current_user_obj))
        ).order_by('timestamp')

        # Serialize messages
        message_data = [
            {'sender': message.sender.username, 'receiver': message.receiver.username, 'content': message.content, 'timestamp': message.timestamp}
            for message in messages
        ]

        return JsonResponse(message_data, safe=False)

