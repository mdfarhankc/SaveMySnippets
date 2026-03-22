# SaveMySnippets

A full-stack code snippet manager built with Django REST Framework and React. Save, organize, search, and share code snippets with syntax highlighting, tagging, and visibility control.

## Tech Stack

**Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, ShadCN/Radix UI, Zustand, TanStack React Query, React Hook Form + Zod, Shiki (syntax highlighting)

**Backend:** Django 5.2, Django REST Framework, SimpleJWT, PostgreSQL (Neon), django-filter

**Deployment:** Render (backend), Vercel (frontend)

## Features

- JWT authentication with token refresh and blacklisting
- Create, edit, delete, duplicate, and download code snippets
- Syntax highlighting with Shiki (200+ languages, dual light/dark themes)
- Public/private visibility control
- Search, sort (date, title), and filter (language, tags)
- Password reset flow with email
- User profile management
- Admin dashboard for managing languages
- Infinite scroll pagination
- Mobile-responsive with hamburger menu
- Dark/light theme toggle

## Project Structure

```
SaveMySnippets/
├── client/          # React frontend (Vite)
├── server/          # Django backend (DRF)
├── docker-compose.yaml
└── render.yaml      # Render deployment config
```

## Local Development

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL (or Neon account)
- [uv](https://docs.astral.sh/uv/) package manager

### Backend

```bash
cd server
cp .env.example .env          # Fill in your database credentials
uv sync                       # Install dependencies
python manage.py migrate      # Run migrations
python manage.py createsuperuser --noinput  # Create admin from .env
python manage.py runserver    # Start on :8000
```

### Frontend

```bash
cd client
cp .env.example .env          # Set VITE_BACKEND_URL
npm install                   # Install dependencies
npm run dev                   # Start on :5173
```

### Docker (PostgreSQL + Backend)

```bash
docker-compose up --build     # Starts PostgreSQL + Django on :8000
```

## API Documentation

Available at `/api/docs/swagger/` and `/api/docs/redoc/` when `DEBUG=True`.

## Deployment

- **Backend (Render):** Uses `render.yaml` blueprint. Connect repo, fill env vars, deploy.
- **Frontend (Vercel):** Connect repo, set root directory to `client`, deploy. SPA routing handled by `vercel.json`.

## License

MIT
