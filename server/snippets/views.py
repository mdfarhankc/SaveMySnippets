from rest_framework import generics, permissions, filters, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from drf_spectacular.utils import extend_schema
from django_filters.rest_framework import DjangoFilterBackend

from .models import Snippet, Language
from .serializers import (
    CreateOrUpdateSnippetSerializer, SnippetSerializer, LanguageSerializer
)
from .permissions import IsOwnerOrReadonly


# ------------------- Snippets ---------------------------
@extend_schema(tags=["Snippets"], description="List public snippets or create a new snippet")
class SnippetListCreateView(generics.ListCreateAPIView):
    """List all public snippets or create a snippet"""
    queryset = Snippet.objects.filter(is_public=True)
    serializer_class = CreateOrUpdateSnippetSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    search_fields = ["title", "content"]
    ordering_fields = ["created_at", "updated_at", "title"]
    ordering = ["-created_at"]
    filterset_fields = {
        "language__name": ["exact"],
        "tags__name": ["exact"],
    }

    def get_serializer_class(self):
        if self.request.method == "GET":
            return SnippetSerializer
        return CreateOrUpdateSnippetSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        """Override to return full snippet data after creation."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        snippet = serializer.save(user=request.user)
        full_data = SnippetSerializer(snippet).data
        return Response(full_data, status=status.HTTP_201_CREATED)


@extend_schema(tags=["Snippets"], description="Get snippet details or update snippet or delete snippet")
class SnippetDetailUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """ Get snippet details or update snippet or delete snippet. """
    queryset = Snippet.objects.all()
    permission_classes = [IsOwnerOrReadonly]
    lookup_field = "slug"

    def get_serializer_class(self):
        if self.request.method in ["PUT", "PATCH"]:
            return CreateOrUpdateSnippetSerializer
        return SnippetSerializer

    def get_object(self):
        obj = super().get_object()
        if not obj.is_public and obj.user != self.request.user:
            raise PermissionDenied("You cannot view this private snippet.")
        return obj


@extend_schema(tags=["Snippets"], description="Get current users snippets")
class UserSnippetsView(generics.ListAPIView):
    """ Get current users snippets. """
    serializer_class = SnippetSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    search_fields = ["title", "content"]
    ordering_fields = ["created_at", "updated_at", "title"]
    ordering = ["-created_at"]
    filterset_fields = {
        "language__name": ["exact"],
        "tags__name": ["exact"],
    }

    def get_queryset(self):
        return Snippet.objects.filter(user=self.request.user)


# ------------- Languages -------------------
@extend_schema(tags=["Languages"], description="List all languages")
class ListLanguagesView(generics.ListAPIView):
    """ List all languages. """
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None


@extend_schema(tags=["Languages"], description="Create a new language (admin only)")
class CreateLanguageView(generics.CreateAPIView):
    """ Create a new language. Admin only. """
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer
    permission_classes = [permissions.IsAdminUser]
