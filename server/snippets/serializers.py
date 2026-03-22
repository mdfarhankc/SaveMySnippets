from rest_framework import serializers

from .models import Snippet, Language, Tag


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name"]


class CreateOrUpdateSnippetSerializer(serializers.ModelSerializer):
    tags = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )

    class Meta:
        model = Snippet
        fields = ["title", "description", "content",
                  "is_public", "language", "tags"]

    def validate_tags(self, tags):
        cleaned = []
        for tag in tags:
            cleaned.append(tag.strip().lower())
        return cleaned

    def _assign_tags(self, snippet, tag_names):
        snippet.tags.clear()
        for name in tag_names:
            tag, _ = Tag.objects.get_or_create(name=name)
            snippet.tags.add(tag)

    def create(self, validated_data):
        tag_names = validated_data.pop("tags", [])
        snippet = Snippet.objects.create(**validated_data)
        self._assign_tags(snippet, tag_names)
        return snippet

    def update(self, instance, validated_data):
        tag_names = validated_data.pop("tags", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if tag_names is not None:
            self._assign_tags(instance, tag_names)
        return instance


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ["id", "name", "extension"]


class SnippetSerializer(serializers.ModelSerializer):
    language = LanguageSerializer()
    tags = serializers.SlugRelatedField(
        many=True, read_only=True, slug_field="name"
    )
    created_by = serializers.CharField(source="user.full_name", read_only=True)
    user_id = serializers.UUIDField(source="user.id", read_only=True)

    class Meta:
        model = Snippet
        fields = [
            "id", "title", "slug", "description", "content", "is_public", "language", "tags", "created_by", "user_id", "created_at", "updated_at"
        ]
