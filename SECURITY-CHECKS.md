# Validation — 2026-10-07

The original Next.js lockfile reported 56 advisories: 3 critical, 34 high, 15 moderate and 4 low. Next.js was updated from 16.2.4 to the latest registry release, 16.4.0, and React was moved from the old canary build to stable 19.3.0 before running it in Docker. Nested dependencies were refreshed. An unused lint preset with an unpatched `braces` dependency was removed.

The subsequent React migration removes Next.js, AI SDKs, Google integration, chat actions and RAG endpoints. Both full and production-only audits of the React lockfile report **zero known vulnerabilities**.

Verified:

- React lint, type checking and production bundle.
- ASP.NET build and combined Docker production image.
- `dotnet publish` builds the frontend and includes its bundle in `wwwroot`.
- Direct SPA links, static JavaScript, images and robots.txt.
- Missing API/asset routes return 404; protected requests return 401.
- Removed chat, embedding and RAG requests return 404.
- Temporary local project data renders in the carousel and detail page, including images and Markdown.
- Login, HttpOnly refresh cookie, bearer identity, refresh, browser reload and logout.

The local preview runs with an isolated database, a localhost-only published port, a non-root API process, a read-only application filesystem, dropped capabilities and no-new-privileges. Image files are mounted read-only for this preview. Test records were removed after verification. No production data or live deployment was changed.

The existing nullable-reference warning in `ProjectSkillController.cs` is unrelated to the migration. The dependency audit covers published npm advisories; it is not an operating-system image vulnerability scan.

The existing SQL backup was subsequently imported into the isolated local preview database: 10 projects, 41 skills, 77 asset references, 65 project/skill associations and one user. Nine historical embeddings are retained as data only; AI/RAG endpoints remain removed. All 71 available image files were verified; six Portfolio VPS screenshot files are absent locally. Project content, skills and the gallery were verified in the browser. The local stack was stopped with its database volume preserved.
