# Copilot Project Instructions

Concise, project-specific guidance for AI coding agents working in this repo. Focus on these patterns and constraints—avoid generic boilerplate.

## 1. Architecture Overview

- Monorepo with 3 runtime components: `aspnet-api/PortfolioBack` (ASP.NET Core Web API), `nextjs-app` (Next.js 14+ App Router, TypeScript, Tailwind), `nginx/` (reverse proxy + static images). Docker Compose orchestrates plus PostgreSQL (pgvector enabled) defined in `db.compose.yaml` / `compose.yaml`.
- Backend exposes REST endpoints under `/api/*` consumed by the frontend via typed helper `lib/utils/api.ts` which derives types from `types/swagger-types.ts`.
- Database schema managed through EF Core migrations (`aspnet-api/PortfolioBack/Migrations`). Vector similarity features rely on pgvector extension + a DB function `search_articles(...)` (invoked in `ProjectSearchService`).
- Auth: Cookie-based (`auth` cookie) with conditional domain + secure settings (see `Program.cs`). API detects API clients and returns 401/403 instead of redirects.

## 2. Backend Conventions (ASP.NET Core)

- Controllers singular-named: `ProjectController`, `SkillController`, etc. Route template: `[Route("api/[controller]")]` -> e.g. `api/Project`.
- Data shaping: Optional `?fields=Id,Title` query used in GET endpoints; logic implemented via `Extensions/DataShapingExtensions` (inspect before extending). Only apply shaping when valid fields provided; fallback to full DTO set.
- DTO mapping via extension methods (`Extensions/*`) converting EF entities to `DTOs/*` types. Maintain symmetry: when adding entity fields, update DTO + mapping + allowed fields for shaping.
- Services encapsulate logic: CRUD services (`ProjectService`, `SkillService`, etc.) injected into controllers; keep controllers thin.
- Search: `IProjectSearchService.SearchProjectsAsync(Vector embedding, threshold, count)` executes raw SQL selecting slug/title/desc/skills JSON. Maintain result shape if altering DB function.
- Embeddings stored on `Project.Embedding` with column type `vector(768)`; maintain dimension consistency.
- Use `ReferenceHandler.IgnoreCycles` already configured—avoid manual circular JSON handling.

## 3. Frontend Conventions (Next.js)

- Uses App Router. Root layout sets global metadata (SEO-critical). Preserve `metadataBase` and OG/Twitter structures when modifying.
- API consumption through `apiCall(endpoint, options)` which:
  - Infers types from `paths` in `swagger-types.ts`.
  - Filters out dynamic endpoints and login endpoints.
  - Adds cookies automatically server-side (SSR) and uses `credentials: 'include'`.
  - Supports optional `query.fields` for backend shaping.
- Auth/session retrieval via server utility `lib/utils/server.ts` (e.g., `getUser()` used in `layout.tsx`). Continue pattern: server components fetch user; pass down as props.
- Component directories: shared UI under `components/ui`, feature-specific under `feature-components/*` (e.g., `chat-box`). Follow existing split when adding new interactive modules.
- Tailwind + shadcn style (see `components.json`). Keep styling utility-first; avoid inline styles unless necessary.

## 4. Cross-Cutting Patterns

- Use cookie name `auth`; do not rename without updating: backend auth config + frontend cookie access + Nginx (if any future rules rely on it).
- Vector search + embedding generation assumed external; if adding embedding writes, ensure dimension = 768 and pgvector extension present.
- Error responses: Services typically return null/false for not-found; controllers translate to `404` / `NoContent`. Keep consistency.
- Raw SQL access only in search service; prefer EF for standard CRUD.
- Field projection: preserve guard clause—if invalid or empty `fields` list, return full DTO.

## 5. Local Dev & Builds

- Backend: `dotnet run` inside `aspnet-api/PortfolioBack` or solution build via task `build` (see workspace tasks). Ensure Postgres running (compose file) before executing vector queries.
- Frontend: `pnpm install` (or `npm install`) then `pnpm dev` inside `nextjs-app`. Environment variables (Supabase, API base) inferred via `getApiUrl`—adjust there for cross-environment changes.
- Full stack via containers: `podman-compose -f db.compose.yaml up --build` (or docker-compose). Production uses `compose.yaml` + Nginx reverse proxy; static images mounted at `/images`.

## 6. When Extending

- Adding an entity: Create Model, DbSet, configure in `OnModelCreating` (indices, constraints), add migration, create Service + Controller, add DTO + mapping, update swagger types if generated manually.
- Adding API endpoint: Prefer extending service; keep controller minimal; ensure DTO coverage + shaping compatibility.
- Frontend consuming new endpoint: update `swagger-types.ts` (regenerate), then call via `apiCall('/api/NewEndpoint', { method: 'GET' })`.
- Maintain SSR-friendly patterns: avoid `window` in server components/utilities.

## 7. Security & Auth Notes

- Cookies: In production secure & SameSite=None; in dev relaxed. Avoid storing sensitive data client-side beyond cookie.
- Login flow excluded from generic API typing (see exclusion rule in `ApiEndpoint` conditional type)—mirror that pattern if adding more auth-only endpoints.

## 8. Performance / SEO

- Metadata centralization in `layout.tsx`; new pages should only refine `export const metadata` not duplicate global values.
- For large project lists, rely on field shaping to reduce payload (e.g., `?fields=Id,Slug,Title`).

## 9. File/Directory Highlights

- Backend Core: `Program.cs`, `Data/PortfolioDbContext.cs`, `Services/`, `Controllers/`, `Extensions/`
- Frontend Core: `app/layout.tsx`, `lib/utils/api.ts`, `types/swagger-types.ts`, `lib/utils/get-url.ts`
- Dev Orchestration: `db.compose.yaml`, `compose.yaml`, `nginx/nginx.conf`

## 10. Do / Avoid

- Do keep controller names singular to match route expectations.
- Do ensure new vector operations respect embedding size 768.
- Avoid adding business logic directly in controllers or raw SQL outside search.
- Avoid breaking the `apiCall` type inference by changing `paths` structure unexpectedly.

---

Questions or unclear area? Ask for: data shaping extensions details, swagger types regeneration process, or embedding generation workflow.
