# Frontend checks

Run `pnpm lint` for React, accessibility, and TypeScript linting, `pnpm type-check` for type checking, and `pnpm build` for the production Vite bundle. Run `pnpm audit` and `pnpm audit --prod` to check published dependency advisories.

The ESLint configuration lists its dependencies directly. TypeScript 6 and ESLint 9 are retained because the installed lint plugins do not support TypeScript 7 / ESLint 10 yet. The unused Next.js lint preset was removed because it pulled in an unpatched vulnerable package.
