### Build stage
FROM node:24-alpine AS builder
WORKDIR /app

# Copy package files & install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code & build the application
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY src ./src
RUN npm run build



### Production stage
FROM node:24-alpine AS production
WORKDIR /app

# Copy package files & only install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Install drizzle-kit for migrations
RUN npm install drizzle-kit

# Copy drizzle config and schema for migrations
COPY drizzle.config.ts ./
COPY --from=builder /app/src/infrastructure/utils/config.ts ./src/infrastructure/utils/config.ts
COPY --from=builder /app/src/infrastructure/persistence/user-schema.ts ./src/infrastructure/persistence/schema.ts

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy proto files (not compiled by TypeScript)
COPY --from=builder /app/src/infrastructure/grpc/proto ./dist/infrastructure/grpc/proto

# Copy and set up entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set permissions
RUN chown -R node:node /app
USER node

# Expose port
ARG PORT=4000
ENV PORT=${PORT}
EXPOSE ${PORT}

# Start the application
ENTRYPOINT ["docker-entrypoint.sh"]
