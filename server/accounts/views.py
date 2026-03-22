from rest_framework.throttling import AnonRateThrottle
from rest_framework import permissions, status, generics
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.core.signing import TimestampSigner, SignatureExpired, BadSignature

from .serializers.auth_serializers import (
    RegisterUserSerializer, MyTokenObtainPairSerializer, LogoutSerializer, UserSerializer,
    UpdateUserSerializer
)
from .serializers.password_reset_serializers import (
    PasswordResetRequestSerializer, PasswordResetConfirmSerializer
)
from .utils.mail import send_password_reset_email, send_verification_email


User = get_user_model()
signer = TimestampSigner()


class LoginThrottle(AnonRateThrottle):
    scope = "login"


class PasswordResetThrottle(AnonRateThrottle):
    scope = "password_reset"


class LoginView(TokenObtainPairView):
    """Custom token view that returns user data along with tokens"""
    throttle_classes = [LoginThrottle]
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    """Register a new user and send verification email"""
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterUserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        token = signer.sign(user.email)
        send_verification_email(user.email, token)

        return Response(
            {"detail": "Account created. Please check your email to verify your account."},
            status=status.HTTP_201_CREATED,
        )


class VerifyEmailView(generics.GenericAPIView):
    """Verify user email with token"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        token = request.data.get("token")
        if not token:
            return Response(
                {"detail": "Token is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            email = signer.unsign(token, max_age=86400)  # 24 hours
        except SignatureExpired:
            return Response(
                {"detail": "Verification link has expired"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except BadSignature:
            return Response(
                {"detail": "Invalid verification link"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if user.is_verified:
            return Response(
                {"detail": "Email already verified"},
                status=status.HTTP_200_OK,
            )

        user.is_verified = True
        user.save(update_fields=["is_verified"])

        return Response(
            {"detail": "Email verified successfully. You can now sign in."},
            status=status.HTTP_200_OK,
        )


class ResendVerificationView(generics.GenericAPIView):
    """Resend verification email"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response(
                {"detail": "Email is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Don't reveal if user exists
            return Response(
                {"detail": "If an account with that email exists, a verification email has been sent."},
                status=status.HTTP_200_OK,
            )

        if user.is_verified:
            return Response(
                {"detail": "Email is already verified"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        token = signer.sign(user.email)
        send_verification_email(user.email, token)

        return Response(
            {"detail": "If an account with that email exists, a verification email has been sent."},
            status=status.HTTP_200_OK,
        )


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
