# Stage 1: Build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY *.csproj .
RUN dotnet restore

# Copy everything else and build
COPY . .
RUN dotnet publish -c release -o /app --no-restore

# Stage 2: Create the final, small image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app ./

# The port the app will listen on *inside* the container
ENV ASPNETCORE_URLS=http://+:5000

# Entrypoint to run the app
ENTRYPOINT ["dotnet", "PortfolioBack.dll"]