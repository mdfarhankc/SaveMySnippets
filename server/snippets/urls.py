from django.urls import path

from .views import (
    SnippetListCreateView, SnippetDetailUpdateDestroyView, UserSnippetsView,
    ListLanguagesView, CreateLanguageView
)

urlpatterns = [
    path("", SnippetListCreateView.as_view(), name="snippet-list-create"),
    path("me/", UserSnippetsView.as_view(), name="user-snippet-list"),
    path("languages/", ListLanguagesView.as_view(), name="languages-list"),
    path("languages/create/", CreateLanguageView.as_view(), name="language-create"),
    path("<slug:slug>/", SnippetDetailUpdateDestroyView.as_view(),
         name="snippet-detail-update-destroy"),
]
