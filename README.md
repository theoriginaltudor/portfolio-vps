# Portfolio

React, TypeScript and Tailwind CSS frontend, served by the ASP.NET Core API. PostgreSQL stores projects, skills, assets and users. The home page introduces Tudor and links to Projects and Contact. AI chat, embedding generation and RAG search have been removed.

## Run locally with Docker

```sh
docker compose -f compose.local.yaml up --build -d
```

Open http://localhost:8000. The API serves both `/api/*` and the React bundle, including direct links such as `/project/example`. This stack uses a separate `portfolio-local` database volume and initializes its schema. It starts with no portfolio content. Your existing `aspnet-api/images` folder is mounted read-only. No production database or shared proxy network is used. Containers run with a read-only application filesystem and dropped capabilities; the published port binds to localhost.

```sh
docker compose -f compose.local.yaml down
```

Stopping retains local data. Avoid `down -v` if you want to keep it.

## Development

Requires Node.js 24, pnpm and .NET 9 SDK.

```sh
cd react-app
pnpm install --frozen-lockfile
pnpm dev
```

Vite runs on http://localhost:5173 and proxies `/api` and `/images` to the API on http://localhost:8000. Run the API with your existing local database and JWT settings:

```sh
dotnet run --project aspnet-api/PortfolioBack
```

Build the bundle first with `pnpm --dir react-app build` when browsing the API directly. The API serves `react-app/dist` during local development. Optional `VITE_IMAGE_URL` configures a separate image origin; its default is same-origin `/images`. Keep secrets out of variables prefixed with `VITE_`.

## Publish and deploy

```sh
dotnet publish aspnet-api/PortfolioBack -c Release -o publish
```

The publish target installs frontend dependencies using the lockfile, builds React, and includes its files under `publish/wwwroot`. `Program.cs` uses `AddSpaStaticFiles`, `UseSpaStaticFiles` and `UseSpa`. Unknown API/asset requests return 404 rather than SPA HTML.

The root Docker build compiles both projects and produces a single ASP.NET runtime image; Node.js is only used during the build. The production `compose.yaml` retains the existing database volume and connects the API to `shared_net`. Both `api` and `frontend` network aliases point to this container. It listens internally on 5000, 8000 and 3000 to support the existing external proxy configuration. TLS still terminates at the reverse proxy. Run deployment using:

```sh
docker compose -f compose.yaml up --build --remove-orphans -d
```

Use the existing root `.env` for PostgreSQL and JWT settings. Google/Supabase keys are no longer needed. Production schema updates remain an explicit deployment operation; only the isolated local stack opts into automatic migrations. Historical vector columns and migrations are retained for compatibility with existing data, but there are no RAG or embedding endpoints.

## Checks

```sh
pnpm --dir react-app audit
pnpm --dir react-app audit --prod
pnpm --dir react-app lint
pnpm --dir react-app build
dotnet build aspnet-api/PortfolioBack
python3 scripts/smoke-test.py http://localhost:8000
```

The migration uses React 19.3.0 and current patched frontend packages. TypeScript 6 and ESLint 9 are kept within the installed lint plugins' supported ranges. Both frontend audits reported zero known vulnerabilities on 2026-10-07. Audit results reflect published advisories, not a guarantee against undiscovered issues.
