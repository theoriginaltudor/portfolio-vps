# syntax=docker/dockerfile:1.7-labs

# Base image with corepack/pnpm enabled
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# Install only production dependencies (cached by lockfile)
FROM base AS deps
COPY pnpm-lock.yaml package.json ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
	pnpm install --frozen-lockfile --prod

# Build stage (installs dev deps to build)
FROM base AS build
COPY pnpm-lock.yaml package.json ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
	pnpm install --frozen-lockfile
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build

# Final runtime image
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /app

# Copy production node_modules and build output
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/.env ./.env

EXPOSE 3000
CMD ["pnpm", "start"]