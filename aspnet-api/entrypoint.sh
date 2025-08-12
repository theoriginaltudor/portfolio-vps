#!/bin/bash
set -ex  # -e: exit on error, -x: print commands

# Ensure dotnet-ef is available
export PATH="$PATH:/root/.dotnet/tools"
if ! command -v dotnet-ef &> /dev/null; then
  dotnet tool install --global dotnet-ef
fi

# Run migrations
cd /app

dotnet tool restore

echo "Checking for pending model changes..."
# Add a new migration if there are pending changes
dotnet ef migrations add "AutoMigration_$(date +%Y%m%d_%H%M%S)" --verbose || echo "No migration needed or migration failed"

echo "Running migrations..."
dotnet ef database update --verbose

# Start the app
exec dotnet PortfolioBack.dll
