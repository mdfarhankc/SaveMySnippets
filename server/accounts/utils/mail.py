from django.core.mail import send_mail
from django.conf import settings


def send_password_reset_email(email, token):
    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"

    subject = "Password Reset Request"
    message = (
        "You requested a password reset.\n\n"
        f"Reset your password using the link below:\n{reset_link}\n\n"
        "If you did not request this, you may safely ignore this email."
    )

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [email],
        fail_silently=False,
    )


def send_verification_email(email, token):
    verify_link = f"{settings.FRONTEND_URL}/verify-email?token={token}"

    subject = "Verify your email address"
    message = (
        "Welcome to SaveMySnippets!\n\n"
        f"Please verify your email address by clicking the link below:\n{verify_link}\n\n"
        "This link expires in 24 hours.\n\n"
        "If you did not create an account, you may safely ignore this email."
    )

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [email],
        fail_silently=False,
    )
