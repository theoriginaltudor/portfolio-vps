# Stage 1: Build the application
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY PortfolioBack/*.csproj ./PortfolioBack/
RUN dotnet restore PortfolioBack/PortfolioBack.csproj

# Copy everything else and build
COPY PortfolioBack/ ./PortfolioBack/
RUN dotnet publish PortfolioBack/PortfolioBack.csproj -c Release -o /app

# Stage 2: Create the final, small image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app ./

# The port the app will listen on *inside* the container
ENV ASPNETCORE_URLS=http://+:5000

# Entrypoint to run the app
ENTRYPOINT ["dotnet", "PortfolioBack.dll"]