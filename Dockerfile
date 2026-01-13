### Build stage
FROM node:22-alpine AS builder
WORKDIR /app

# Copy package files & install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code & build the application
COPY tsconfig.json ./
COPY drizzle.config.ts ./
COPY src ./src
RUN npm run build



### Production stage
FROM node:22-alpine AS production
WORKDIR /app

# Copy package files & only install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Set permissions
RUN chown -R node:node /app
USER node

# Expose port
EXPOSE 3000
# Start the application
CMD ["node", "dist/server.js"]
