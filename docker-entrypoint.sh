#!/bin/sh
set -e

echo "Running database migrations..."
npx drizzle-kit push --config=drizzle.config.ts

echo "Setting up RabbitMQ topology..."
node dist/infrastructure/messaging/setup-rabbitmq.js

echo "Starting application..."
exec node dist/server.js
