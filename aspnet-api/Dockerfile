# syntax=docker/dockerfile:1
FROM node:24-alpine AS frontend
WORKDIR /src/react-app
RUN corepack enable
COPY react-app/package.json react-app/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY react-app/ ./
RUN pnpm run lint && pnpm run build

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS backend
WORKDIR /src
COPY aspnet-api/PortfolioBack/PortfolioBack.csproj aspnet-api/PortfolioBack/
RUN dotnet restore aspnet-api/PortfolioBack/PortfolioBack.csproj
COPY aspnet-api/PortfolioBack/ aspnet-api/PortfolioBack/
RUN dotnet publish aspnet-api/PortfolioBack/PortfolioBack.csproj -c Release -o /publish /p:BuildSpa=false --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runner
WORKDIR /app
COPY --from=backend /publish ./
COPY --from=frontend /src/react-app/dist ./wwwroot
ENV ASPNETCORE_URLS=http://+:5000 Images__Path=/app/images
USER $APP_UID
EXPOSE 5000
ENTRYPOINT ["dotnet", "PortfolioBack.dll"]
