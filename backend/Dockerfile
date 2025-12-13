# Multi-stage Dockerfile for building and running the TypeScript + Prisma backend
# Stage 1 - build
FROM node:18-alpine AS builder
WORKDIR /app

# Install build tools
COPY package*.json ./
RUN npm ci

# Copy source files
COPY . .

# Generate Prisma client and build TS
RUN npx prisma generate
RUN npm run build

# Stage 2 - runtime
FROM node:18-alpine AS runner
WORKDIR /app

# Install only production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built files and node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
# Copy Prisma schema and migrations for runtime migrate
COPY --from=builder /app/src/prisma ./src/prisma

# Create uploads directory (app serves uploads path)
RUN mkdir -p uploads

ENV NODE_ENV=production
EXPOSE 5000

# Run migrations then start the compiled server
CMD ["sh", "-c", "npx prisma migrate deploy --schema src/prisma/schema.prisma && node build/index.js"]
