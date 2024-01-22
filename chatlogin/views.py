from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializer import CustomUserSerializer
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
from django.contrib.auth import get_user_model, login
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
class CustomUserAndInterestView(APIView):
    def post(self, request):
        data = request.data

        # Extract interests data, defaulting to an empty list if not present
        interests_data = data.get('interests', [])

        # Set the 'interests' field to the extracted interests_data
        data['interests'] = interests_data

        serializer = CustomUserSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomUserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        email = data.get("email", None)
        password = data.get("password", None)

        if email is None or password is None:
            return Response({"error": "You must provide 'email' and 'password'"})

        # Use your custom user model
        User = get_user_model()

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Invalid credentials"})

        if user.check_password(password):
            login(request, user)
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            response_data = {
                "user_id": user.id,
                "email": user.email,
                "access_token": access_token,
            }

            response = Response(response_data)
            response.set_cookie(key="access_token", value=access_token, httponly=True)
            return response
        else:
            return Response({"error": "Invalid credentials"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def validate_token(request):
    user = request.user
    return Response({"message": "Token is valid", "user_id": user.id, "email": user.email})
