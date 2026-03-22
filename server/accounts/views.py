from rest_framework.throttling import AnonRateThrottle
from rest_framework import permissions, status, generics
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

from .serializers.auth_serializers import (
    RegisterUserSerializer, MyTokenObtainPairSerializer, LogoutSerializer, UserSerializer,
    UpdateUserSerializer
)
from .serializers.password_reset_serializers import (
    PasswordResetRequestSerializer, PasswordResetConfirmSerializer
)
from .utils.mail import send_password_reset_email


User = get_user_model()


class LoginThrottle(AnonRateThrottle):
    scope = "login"


class PasswordResetThrottle(AnonRateThrottle):
    scope = "password_reset"


class LoginView(TokenObtainPairView):
    """Custom token view that returns user data along with tokens"""
    throttle_classes = [LoginThrottle]
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    """Register a new user and returns user data along with tokens"""
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterUserSerializer


class LogoutView(generics.GenericAPIView):
    """Blacklist the refresh token"""
    serializer_class = LogoutSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Logout successful"}, status=status.HTTP_204_NO_CONTENT)


class AuthUserView(generics.RetrieveUpdateAPIView):
    """Return or update the authenticated user's data"""
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ["PUT", "PATCH"]:
            return UpdateUserSerializer
        return UserSerializer

    def get_object(self):
        return self.request.user


class PasswordResetRequestView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [PasswordResetThrottle]
    serializer_class = PasswordResetRequestSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        token = serializer.create_reset_token(email)
        send_password_reset_email(email, token)

        return Response({"detail": "Password reset email sent."}, status=status.HTTP_200_OK)


class PasswordResetConfirmView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = PasswordResetConfirmSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save()
        return Response({"detail": "Password reset successful."}, status=status.HTTP_200_OK)
