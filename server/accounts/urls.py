from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    LoginView, LogoutView, RegisterView, AuthUserView,
    PasswordResetRequestView, PasswordResetConfirmView,
    VerifyEmailView, ResendVerificationView,
)


urlpatterns = [
    path('login/', LoginView.as_view(), name='user_login'),
    path('register/', RegisterView.as_view(), name='user_register'),
    path('logout/', LogoutView.as_view(), name='user_logout'),
    path('me/', AuthUserView.as_view(), name='user_loggedin'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Email Verification
    path('verify-email/', VerifyEmailView.as_view(), name='verify_email'),
    path('resend-verification/', ResendVerificationView.as_view(),
         name='resend_verification'),
    # Password Reset
    path('password-reset/', PasswordResetRequestView.as_view(),
         name='password_reset_request'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(),
         name='password_reset_confirm'),
]
