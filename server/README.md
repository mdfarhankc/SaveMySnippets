# SaveMySnippets — Backend

Django REST Framework API for SaveMySnippets, a code snippet manager.

## Tech Stack

- Django 5.2 + Django REST Framework 3.17
- SimpleJWT (authentication with token blacklisting)
- PostgreSQL (Neon for production)
- django-filter (language/tag filtering)
- drf-spectacular (OpenAPI docs)
- Gunicorn + Uvicorn (production ASGI server)
- uv (package manager)

## Getting Started

```bash
cp .env.example .env              # Fill in credentials
uv sync                           # Install dependencies
python manage.py migrate          # Run migrations
python manage.py createsuperuser --noinput  # Create admin from env vars
python manage.py runserver        # http://localhost:8000
```

## API Endpoints

### Authentication (`/api/auth/`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/login/` | Login, returns tokens + user |
| POST | `/register/` | Register new user |
| POST | `/logout/` | Blacklist refresh token |
| GET/PATCH | `/me/` | Get or update authenticated user |
| POST | `/token/refresh/` | Refresh access token |
| POST | `/password-reset/` | Request password reset email |
| POST | `/password-reset-confirm/` | Confirm password reset |

### Snippets (`/api/snippets/`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List public snippets (search, sort, filter) |
| POST | `/` | Create snippet (authenticated) |
| GET | `/me/` | List user's snippets (search, sort, filter) |
| GET | `/<slug>/` | Get snippet detail |
| PUT/PATCH | `/<slug>/` | Update snippet (owner only) |
| DELETE | `/<slug>/` | Delete snippet (owner only) |
| GET | `/languages/` | List all languages |
| POST | `/languages/create/` | Create language (admin only) |

### Query Parameters (list endpoints)

| Parameter | Example | Description |
|-----------|---------|-------------|
| `search` | `?search=django` | Search title and content |
| `ordering` | `?ordering=-created_at` | Sort by field (prefix `-` for desc) |
| `language__name` | `?language__name=Python` | Filter by language |
| `tags__name` | `?tags__name=auth` | Filter by tag |
| `limit` | `?limit=20` | Pagination limit |
| `offset` | `?offset=40` | Pagination offset |

### API Documentation

Available at `/api/docs/swagger/` and `/api/docs/redoc/` when `DEBUG=True`.

## Project Structure

```
server/
├── core/              # Settings, root URLs, ASGI/WSGI
├── accounts/          # Custom User model, JWT auth, password reset
│   ├── models.py      # UUID PK, email-based auth
│   ├── views.py       # Login, Register, Logout, AuthUser, PasswordReset
│   ├── serializers/   # Auth + password reset serializers
│   └── utils/         # Email utilities
├── snippets/          # Snippet CRUD, languages, tags
│   ├── models.py      # Snippet, Language, Tag (all UUID PKs)
│   ├── views.py       # List, detail, user snippets, languages
│   ├── serializers.py # Read vs write serializers
│   └── permissions.py # IsOwnerOrReadonly
├── Dockerfile         # Multi-stage build with uv
├── .env.example       # Environment variable template
└── .env.docker        # Docker Compose env vars
```

## Key Patterns

- **Separate read/write serializers:** `SnippetSerializer` for GET, `CreateOrUpdateSnippetSerializer` for POST/PUT
- **Slug-based URLs:** Auto-generated unique slugs for snippets
- **Rate limiting:** 10/min login, 5/min password reset, 1000/day authenticated
- **SSL database:** Conditional `sslmode=require` via `DATABASE_SSLMODE` env var
- **Email:** Console backend in dev, SMTP in production

## Deployment

Deploy to Render using the `render.yaml` blueprint in the project root. Set environment variables for database, email, CORS, and allowed hosts.

## Environment Variables

See `.env.example` for the full list.
