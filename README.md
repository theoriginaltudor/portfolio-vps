# Portfolio VPS

This repository contains a full-stack portfolio website and API, designed for deployment via containers and orchestration. It consists of three main components:

## Architecture

- **ASP.NET Core API (`aspnet-api/PortfolioBack`)**: Serves as the backend for portfolio data, projects, skills, and assets. Uses PostgreSQL (with pgvector) for storage and supports vector search for advanced queries. Provides RESTful endpoints for frontend consumption.
- **Next.js Frontend (`nextjs-app`)**: A modern, responsive portfolio site built with Next.js, React, TypeScript, Tailwind CSS, and Supabase. Features include an AI-powered chat, project gallery with carousels, contact page, dark mode, and integration with Supabase for data and image storage.
- **PostgreSQL**: Database service with vector search support for semantic queries.

## Features

- **AI-powered chat** (frontend)
- **Project gallery** with carousels
- **Contact page**
- **Responsive design & dark mode**
- **Supabase integration**
- **RESTful API for projects, skills, assets, and search**
- **Containerized deployment with Docker Compose**

## Development & Deployment

### Prerequisites

- Docker
- Node.js & npm (for frontend development)
- .NET SDK (for backend development)

### Local Development

1. **Clone the repository:**
   ```zsh
   git clone https://github.com/theoriginaltudor/portfolio-vps.git
   cd portfolio-vps
   ```
2. **Start services (all containers):**
   ```zsh
   podman-compose -f db.compose.yaml up --build
   # or
   docker-compose -f db.compose.yaml up --build
   ```
3. **Frontend:**
   ```zsh
   cd nextjs-app
   npm install
   npm run dev
   ```
4. **Backend:**
   ```zsh
   cd aspnet-api/PortfolioBack
   dotnet run
   ```

### Production Deployment

- Use `compose.yaml` for production orchestration.
- Nginx reverse proxies requests to Next.js and serves images from `/images/`.
- Environment variables for database and API connections are required.

## API Endpoints

- `/api/projects` – List all projects
- `/api/skills` – List all skills
- `/api/assets` – Project assets
- `/api/search` – Vector search for projects
- `/api/data-transfer` – Data transfer operations

## Tech Stack

- ASP.NET Core, Entity Framework Core, PostgreSQL (pgvector)
- Next.js, React, TypeScript, Tailwind CSS, Supabase
- Docker / Podman Compose

## Folder Structure

- `aspnet-api/PortfolioBack/` – Backend API
- `nextjs-app/` – Frontend app
- `compose.yaml`, `dev.compose.yaml` – Container orchestration

## License

MIT

---

For more details, see the individual README files in `nextjs-app/` and backend folders.
