#!/bin/bash
set -e

# Ensure dotnet-ef is available
export PATH="$PATH:/root/.dotnet/tools"
if ! command -v dotnet-ef &> /dev/null; then
  dotnet tool install --global dotnet-ef
fi

# Run migrations
cd /app

dotnet ef database update --project PortfolioBack.csproj --startup-project PortfolioBack.csproj

# Start the app
exec dotnet PortfolioBack.dll
