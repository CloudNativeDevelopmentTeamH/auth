#!/bin/sh
set -e

echo "Running database migrations..."
npx drizzle-kit push --config=drizzle.config.ts

echo "Starting application..."
exec node dist/server.js
