# serializers.py

from rest_framework import serializers
from .models import CustomUser, Interest

class InterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interest
        fields = ['id', 'name']

class CustomUserSerializer(serializers.ModelSerializer):
    interests = InterestSerializer(many=True, required=False)

    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'password', 'email', 'full_name', 'phone',
            'gender', 'country', 'is_online', 'interests'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        interests_data = validated_data.pop('interests', [])
        user = CustomUser.objects.create_user(**validated_data)

        interests = [Interest(user=user, **interest_data) for interest_data in interests_data]
        Interest.objects.bulk_create(interests)

        return user
