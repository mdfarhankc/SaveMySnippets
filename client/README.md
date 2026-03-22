# SaveMySnippets — Frontend

React frontend for SaveMySnippets, a code snippet manager with syntax highlighting, search, and sharing.

## Tech Stack

- React 19 + TypeScript + Vite 8
- Tailwind CSS v4 + ShadCN/Radix UI
- Zustand (auth state, persisted to localStorage)
- TanStack React Query (data fetching with 5-min cache)
- React Hook Form + Zod v4 (form validation)
- Shiki (syntax highlighting, dual theme support)
- React Router v7

## Getting Started

```bash
cp .env.example .env    # Set VITE_BACKEND_URL
npm install
npm run dev             # http://localhost:5173
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | TypeScript check + production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## Project Structure

```
src/
├── components/
│   ├── common/        # BackButton, Loading, Logo, UserButton, ErrorBoundary
│   ├── layouts/       # RootLayout, Header, Footer, AuthLayout, ProtectedLayout
│   ├── snippets/      # SnippetCard, SnippetForm, CodeHighlighter
│   ├── languages/     # LanguageSelector
│   ├── theme/         # ThemeProvider, ThemeToggle
│   └── ui/            # ShadCN components
├── hooks/
│   ├── auth/          # useLogin, useRegister, useLogout, useAuthUser, usePasswordReset, useUpdateProfile
│   ├── snippets/      # useGetPublicSnippets, useGetUserSnippets, useCreateSnippets, useUpdateSnippet, useDeleteSnippet
│   └── languages/     # useGetLanguages, useCreateLanguage
├── pages/
│   ├── (auth)/        # Login, Register, ForgotPassword, ResetPassword
│   ├── (main)/        # Dashboard, SnippetDetail, CreateSnippet, EditSnippet, Profile, AdminDashboard
│   └── (root)/        # Explore, Contact
├── store/             # Zustand auth store
├── types/             # TypeScript interfaces
├── validations/       # Zod schemas
├── lib/               # Axios instance, utils, constants
└── routes/            # React Router config
```

## Key Patterns

- **API layer:** Axios instance with JWT injection and automatic token refresh on 401
- **Auth guard:** `ProtectedLayout` checks both `authUser` and `access` token
- **Infinite scroll:** IntersectionObserver-based pagination on Dashboard and Explore
- **Debounced search:** 400ms debounce on search inputs
- **Dual theme:** Shiki uses `github-light`/`github-dark` based on CSS class

## Deployment

Deploy to Vercel with root directory set to `client`. The `vercel.json` handles SPA routing.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_BACKEND_URL` | Backend API URL | `http://localhost:8000/api` |
