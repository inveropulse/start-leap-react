# Enterprise React Starter - Production Dockerfile
FROM node:22-alpine AS base

# Install pnpm
RUN corepack enable && corepack use pnpm@9.12.0

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/config/package.json ./packages/config/
COPY packages/ui/package.json ./packages/ui/
COPY packages/utils/package.json ./packages/utils/
COPY apps/web/package.json ./apps/web/

# Install dependencies
FROM base AS deps
RUN pnpm install --frozen-lockfile

# Build shared packages
FROM deps AS build-packages
COPY packages/ ./packages/
RUN pnpm --filter="@company/*" build

# Build web application
FROM build-packages AS build-web
COPY apps/web/ ./apps/web/
RUN pnpm --filter="@company/web" build

# Production image
FROM nginx:alpine AS production

# Install security headers
RUN apk add --no-cache nginx-mod-http-headers-more

# Copy custom nginx config
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Copy built application
COPY --from=build-web /app/apps/web/dist /usr/share/nginx/html

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]