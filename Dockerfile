# Stage 1: Build the React application
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# Copy package files
COPY package*.json ./

# Install dependencies with security focus
RUN npm ci --only=production --legacy-peer-deps && npm cache clean --force

# Copy source code and change ownership
COPY --chown=nodejs:nodejs . .

# Switch to non-root user for build
USER nodejs

# Set environment to production
ENV NODE_ENV=production

# Build the application and verify output
RUN npm run build && \
    ls -la dist/ && \
    echo "Build completed successfully"

# Stage 2: Production nginx server
FROM nginx:1.25-alpine AS production

# Install curl for health checks and security updates
RUN apk --no-cache add curl && \
    apk --no-cache upgrade

# Create nginx user and directories (nginx user already exists in nginx image)
RUN mkdir -p /var/log/nginx /var/cache/nginx /var/run && \
    chown -R nginx:nginx /var/log/nginx /var/cache/nginx /var/run

# Copy built application
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY --chown=nginx:nginx nginx.conf /etc/nginx/nginx.conf

# Remove default nginx config
RUN rm -f /etc/nginx/conf.d/default.conf

# Verify files were copied correctly
RUN ls -la /usr/share/nginx/html/

# Switch to non-root user
USER nginx

# Use environment variable for port (Azure Container Apps default)
ENV PORT=80
EXPOSE $PORT

# Health check using curl
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:$PORT/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
