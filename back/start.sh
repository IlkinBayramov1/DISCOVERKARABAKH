#!/bin/sh
# Exit immediately if a command exits with a non-zero status
set -e

echo "🚀 Production Bootstrap: Running database migrations..."
npx prisma migrate deploy || { echo "❌ Database migration failed! Exiting bootstrap."; exit 1; }

echo "✅ Database migrations successfully applied!"

echo "⚙️ Starting Discover Karabakh backend server..."
exec node server.js
