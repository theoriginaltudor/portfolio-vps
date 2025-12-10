# Stage 1: Build the application
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY PortfolioBack/*.csproj ./PortfolioBack/
RUN dotnet restore PortfolioBack/PortfolioBack.csproj

# Copy everything else and build
COPY PortfolioBack/ ./PortfolioBack/
RUN dotnet publish PortfolioBack/PortfolioBack.csproj -c Release -o /app

## Use SDK image for final stage to allow migrations at runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app ./
# No need to copy source or restore in final stage—entrypoint.sh handles migrations using the SDK

# The port the app will listen on *inside* the container
ENV ASPNETCORE_URLS=http://+:5000

# Entrypoint to run the app
ENTRYPOINT ["dotnet", "PortfolioBack.dll"]