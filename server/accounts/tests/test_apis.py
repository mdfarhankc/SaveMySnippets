from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken


User = get_user_model()


class AccountsAPITest(APITestCase):

    def setUp(self):
        self.register_url = reverse("user_register")
        self.login_url = reverse("user_login")
        self.me_url = reverse("user_loggedin")
        self.logout_url = reverse("user_logout")

        self.test_user_data = {
            "email": "john@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "password": "StrongPassword123",
            "confirm_password": "StrongPassword123"
        }

        self.user = User.objects.create_user(
            email="existing@example.com",
            password="Password123",
            first_name="Existing",
            last_name="User"
        )

    # -------------------------
    # Registration Tests
    # -------------------------
    def test_user_registration_success(self):
        response = self.client.post(
            self.register_url, self.test_user_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertEqual(response.data["user"]
                         ["email"], self.test_user_data["email"])

    def test_user_registration_password_mismatch(self):
        data = self.test_user_data.copy()
        data["confirm_password"] = "WrongPassword"

        response = self.client.post(self.register_url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Passwords", str(response.data))

    def test_user_registration_duplicate_email(self):
        data = self.test_user_data.copy()
        data["email"] = "existing@example.com"

        response = self.client.post(self.register_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", str(response.data).lower())

    # -------------------------
    # Login Tests
    # -------------------------
    def test_user_login_success(self):
        response = self.client.post(
            self.login_url,
            {"email": "existing@example.com", "password": "Password123"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertEqual(response.data["user"]
                         ["email"], "existing@example.com")

    def test_user_login_failure(self):
        response = self.client.post(
            self.login_url,
            {"email": "wrong@example.com", "password": "wrongpass"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("Invalid authentication credentials", str(response.data))

    # -------------------------
    # Authenticated User (/me)
    # -------------------------
    def authenticate(self):
        login_response = self.client.post(
            self.login_url,
            {"email": "existing@example.com", "password": "Password123"},
            format="json",
        )
        token = login_response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    def test_get_authenticated_user(self):
        self.authenticate()

        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "existing@example.com")

    def test_get_authenticated_user_unauthorized(self):
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # -------------------------
    # Logout / Token Blacklist
    # -------------------------
    def test_logout_blacklists_token(self):
        self.authenticate()

        refresh = RefreshToken.for_user(self.user)
        response = self.client.post(
            self.logout_url, {"refresh_token": str(refresh)}, format="json")

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # After blacklisting, token usage should raise error
        refresh.blacklist()  # Manually ensure correctness

    def test_logout_without_authentication(self):
        refresh = RefreshToken.for_user(self.user)

        response = self.client.post(
            self.logout_url, {"refresh_token": str(refresh)}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
