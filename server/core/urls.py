from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.http import JsonResponse
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

urlpatterns = [
    path("", lambda r: JsonResponse({"status": "ok", "service": "SaveMySnippets API"})),
    path("admin/", admin.site.urls),
    # Local urls
    path('api/auth/', include('accounts.urls')),
    path('api/snippets/', include('snippets.urls')),
]

if settings.DEBUG:
    urlpatterns += [
        # OpenAPI schema
        path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
        # Swagger UI
        path("api/docs/swagger/",
             SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui",),
        # Redoc UI
        path("api/docs/redoc/",
             SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
    ]
