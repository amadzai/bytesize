![Bytesize logo](docs/screenshots/icons/bytesize-yellow.png)

# Bytesize - URL Shortener

A URL shortener application that creates unique short links, supports fast redirects, and tracks visit analytics.

## Setup and Dependencies

This project is a monorepo with **Ruby on Rails (API) + PostgreSQL** for the backend and **React (TS Vite) + Tailwind** for the frontend.

### Core Dependencies

- Backend: Docker (with Compose)
- Frontend: Node.js (LTS) and pnpm 9+

For full dependency details, see [`backend/Gemfile`](backend/Gemfile) and [`frontend/package.json`](frontend/package.json).

### Local Setup

1. Start the backend (Rails API + PostgreSQL via Docker):

   ```bash
   cd backend
   docker compose -f docker-compose.dev.yml up --build
   ```

2. In a new terminal, start the frontend:

   ```bash
   cd frontend
   pnpm install
   pnpm dev
   ```

3. Open the app:
   - Frontend App: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:3000](http://localhost:3000)

### Workspace

If you are using VS Code/Cursor, open the monorepo workspace file so project-specific settings and extensions (e.g., Ruby LSP) work as intended:

- [monorepo.code-workspace](monorepo.code-workspace)

### API Docs (Swagger UI)

After starting the backend in development, view Swagger UI at:

- [http://localhost:3000/swagger](http://localhost:3000/swagger)

> Note: Swagger routes are available in development only.

## Project Structure

```
bytesize/
├── backend/                          # Ruby on Rails API (URL shortener + analytics)
│   ├── app/
│   │   ├── controllers/              # API controllers (Urls, Analytics)
│   │   ├── models/                   # ActiveRecord models (Url, Analytic)
│   │   ├── services/                 # Service objects (Urls, Analytics logic)
│   │   ├── jobs/                     # Background jobs (Analytics)
│   │   └── validators/               # Custom validators (Url validation)
│   ├── config/                       # Rails configuration and routes
│   ├── db/                           # Schema, migrations
│   ├── test/                         # Backend test suite
│   ├── Dockerfile / docker-compose*  # Backend/container setup
│   └── Gemfile                       # Ruby dependencies
├── frontend/                         # React + TypeScript app (Vite)
│   ├── src/
│   │   ├── pages/                    # Main pages (Home, Analytics)
│   │   ├── components/               # Reusable UI components
│   │   ├── api/                      # API client
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── types/                    # Shared TS types/interfaces
│   │   ├── layouts/                  # Layout components
│   │   └── utils/                    # Frontend utilities/helpers
│   └── package.json                  # Frontend dependencies/scripts
├── docs/                             # Project documentation and assets
```

## High-Level Design

This diagram shows the main request path between client, Rails API, and PostgreSQL.

![High-level design diagram](docs/diagrams/high-level-design.png)

For step-by-step request flows (URL shortening and redirect), see [`docs/diagrams/`](docs/diagrams/).

## Deployed URL

Bytesize App: [https://app.bytesize.now/](https://app.bytesize.now/)

- The backend API is deployed on a Contabo VPS using Docker, with Nginx as a reverse proxy.
- The frontend is deployed on Vercel.
