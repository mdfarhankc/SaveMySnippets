from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Snippet, Language, Tag

User = get_user_model()


class SnippetsAPITest(APITestCase):

    def setUp(self):
        self.list_create_url = reverse("snippet-list-create")
        self.user_snippets_url = reverse("user-snippet-list")
        self.languages_url = reverse("languages-list")

        self.user = User.objects.create_user(
            email="testuser@example.com",
            password="Password123",
            first_name="Test",
            last_name="User",
        )
        self.other_user = User.objects.create_user(
            email="other@example.com",
            password="Password123",
            first_name="Other",
            last_name="User",
        )
        self.language = Language.objects.create(name="Python", extension="py")
        self.tag = Tag.objects.create(name="django")

        self.snippet_data = {
            "title": "Hello World Script",
            "content": "print('hello world')",
            "language": str(self.language.id),
            "is_public": True,
            "tags": ["django"],
        }

    def authenticate(self, user=None):
        user = user or self.user
        self.client.force_authenticate(user=user)

    # -------------------------
    # Create Snippet
    # -------------------------
    def test_create_snippet_authenticated(self):
        self.authenticate()
        response = self.client.post(self.list_create_url, self.snippet_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "Hello World Script")
        self.assertTrue(response.data["slug"])

    def test_create_snippet_unauthenticated(self):
        response = self.client.post(self.list_create_url, self.snippet_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # -------------------------
    # List Public Snippets
    # -------------------------
    def test_list_public_snippets(self):
        self.authenticate()
        self.client.post(self.list_create_url, self.snippet_data, format="json")

        self.client.force_authenticate(user=None)
        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)

    def test_private_snippets_not_in_public_list(self):
        self.authenticate()
        data = self.snippet_data.copy()
        data["is_public"] = False
        self.client.post(self.list_create_url, data, format="json")

        self.client.force_authenticate(user=None)
        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 0)

    # -------------------------
    # Get Snippet Detail
    # -------------------------
    def test_get_public_snippet_detail(self):
        self.authenticate()
        create_response = self.client.post(self.list_create_url, self.snippet_data, format="json")
        slug = create_response.data["slug"]

        self.client.force_authenticate(user=None)
        url = reverse("snippet-detail-update-destroy", kwargs={"slug": slug})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Hello World Script")

    def test_get_private_snippet_by_non_owner(self):
        self.authenticate()
        data = self.snippet_data.copy()
        data["is_public"] = False
        create_response = self.client.post(self.list_create_url, data, format="json")
        slug = create_response.data["slug"]

        self.authenticate(self.other_user)
        url = reverse("snippet-detail-update-destroy", kwargs={"slug": slug})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # -------------------------
    # Update Snippet
    # -------------------------
    def test_update_snippet_by_owner(self):
        self.authenticate()
        create_response = self.client.post(self.list_create_url, self.snippet_data, format="json")
        slug = create_response.data["slug"]

        url = reverse("snippet-detail-update-destroy", kwargs={"slug": slug})
        response = self.client.patch(url, {"title": "Updated Title"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_snippet_by_non_owner(self):
        self.authenticate()
        create_response = self.client.post(self.list_create_url, self.snippet_data, format="json")
        slug = create_response.data["slug"]

        self.authenticate(self.other_user)
        url = reverse("snippet-detail-update-destroy", kwargs={"slug": slug})
        response = self.client.patch(url, {"title": "Hacked"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # -------------------------
    # Delete Snippet
    # -------------------------
    def test_delete_snippet_by_owner(self):
        self.authenticate()
        create_response = self.client.post(self.list_create_url, self.snippet_data, format="json")
        slug = create_response.data["slug"]

        url = reverse("snippet-detail-update-destroy", kwargs={"slug": slug})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Snippet.objects.filter(slug=slug).exists())

    def test_delete_snippet_by_non_owner(self):
        self.authenticate()
        create_response = self.client.post(self.list_create_url, self.snippet_data, format="json")
        slug = create_response.data["slug"]

        self.authenticate(self.other_user)
        url = reverse("snippet-detail-update-destroy", kwargs={"slug": slug})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # -------------------------
    # User Snippets
    # -------------------------
    def test_get_user_snippets(self):
        self.authenticate()
        self.client.post(self.list_create_url, self.snippet_data, format="json")

        response = self.client.get(self.user_snippets_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)

    def test_user_snippets_unauthenticated(self):
        response = self.client.get(self.user_snippets_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # -------------------------
    # Search
    # -------------------------
    def test_search_public_snippets(self):
        self.authenticate()
        self.client.post(self.list_create_url, self.snippet_data, format="json")

        self.client.force_authenticate(user=None)
        response = self.client.get(self.list_create_url, {"search": "Hello"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)

        response = self.client.get(self.list_create_url, {"search": "nonexistent"})
        self.assertEqual(response.data["count"], 0)

    # -------------------------
    # Languages
    # -------------------------
    def test_list_languages(self):
        response = self.client.get(self.languages_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Python")

    # -------------------------
    # Slug Uniqueness
    # -------------------------
    def test_duplicate_title_creates_unique_slug(self):
        self.authenticate()
        self.client.post(self.list_create_url, self.snippet_data, format="json")
        response2 = self.client.post(self.list_create_url, self.snippet_data, format="json")
        self.assertEqual(response2.status_code, status.HTTP_201_CREATED)
        self.assertNotEqual(
            Snippet.objects.first().slug,
            Snippet.objects.last().slug,
        )
