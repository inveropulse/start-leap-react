# Deployment Guide

## 🚀 Deployment Overview

This enterprise React starter supports multiple deployment strategies:

- **Static Hosting:** Netlify, Vercel, GitHub Pages
- **Container Deployment:** Docker + Kubernetes, Docker Compose
- **CDN Deployment:** AWS CloudFront, Cloudflare
- **Self-Hosted:** Nginx, Apache

## 📦 Build Process

### Production Build

```bash
# Build all packages and web app
pnpm build

# Analyze build (optional)
./tools/scripts/build-analyze.sh

# Build artifacts location
ls apps/web/dist/
```

### Build Optimization

The build process includes:
- **Tree shaking** for unused code elimination
- **Code splitting** for optimal loading
- **Asset optimization** (images, fonts, etc.)
- **Minification** and compression
- **Source maps** for debugging

## 🐳 Docker Deployment

### Single Container (Recommended)

```bash
# Build production image
docker build -t enterprise-app:latest .

# Run container
docker run -p 80:80 enterprise-app:latest
```

### Multi-Container with Docker Compose

```bash
# Development environment
docker-compose -f docker-compose.yml up -d

# Production environment
docker-compose -f docker-compose.prod.yml up -d
```

### Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    ports:
      - "80:80"
      - "443:443"
    environment:
      - NODE_ENV=production
    volumes:
      - ./docker/ssl:/etc/nginx/ssl:ro
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.web.rule=Host(`yourdomain.com`)"

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - redis_data:/data

volumes:
  redis_data:
```

## ☁️ Cloud Deployment

### Vercel (Recommended for Static)

1. **Connect repository:**
   ```bash
   npm i -g vercel
   vercel --prod
   ```

2. **Configure build settings:**
   ```json
   {
     "buildCommand": "pnpm build",
     "outputDirectory": "apps/web/dist",
     "installCommand": "pnpm install"
   }
   ```

3. **Environment variables:**
   Add in Vercel dashboard or `.env.production`

### Netlify

1. **Build settings:**
   - Build command: `pnpm build`
   - Publish directory: `apps/web/dist`
   - Node version: `18`

2. **Netlify configuration** (`netlify.toml`):
   ```toml
   [build]
     publish = "apps/web/dist"
     command = "pnpm build"

   [build.environment]
     NODE_VERSION = "18"
     PNPM_VERSION = "9.12.0"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

### AWS S3 + CloudFront

1. **Build and upload:**
   ```bash
   pnpm build
   aws s3 sync apps/web/dist/ s3://your-bucket-name
   ```

2. **CloudFront configuration:**
   - Origin: S3 bucket
   - Default root object: `index.html`
   - Error pages: `404` → `/index.html` (for SPA routing)

## 🌐 Self-Hosted Deployment

### Nginx Configuration

Create `/etc/nginx/sites-available/enterprise-app`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # App files
    location / {
        root /var/www/enterprise-app;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API proxy (if needed)
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Apache Configuration

Create `.htaccess` in web root:

```apache
RewriteEngine On
RewriteBase /

# Handle client-side routing
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security headers
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"

# Cache static assets
<filesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
    ExpiresActive on
    ExpiresDefault "access plus 1 year"
</filesMatch>
```

## 🔧 Environment Configuration

### Environment Variables

Create environment-specific files:

**`.env.production`:**
```env
NODE_ENV=production
VITE_APP_NAME="Enterprise App"
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
VITE_SENTRY_DSN=your-sentry-dsn
```

**`.env.staging`:**
```env
NODE_ENV=staging
VITE_APP_NAME="Enterprise App (Staging)"
VITE_API_BASE_URL=https://staging-api.yourdomain.com
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=true
```

### Build-time vs Runtime Variables

- **Build-time:** `VITE_*` variables are bundled into the app
- **Runtime:** Server-side variables stay on the server

## 🔒 Security Considerations

### HTTPS Configuration

1. **SSL Certificate:**
   ```bash
   # Let's Encrypt (free)
   certbot --nginx -d yourdomain.com
   
   # Or use your SSL provider
   ```

2. **Security Headers:**
   ```nginx
   # Content Security Policy
   add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
   
   # HSTS
   add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
   ```

### Environment Security

- Never expose sensitive data in `VITE_*` variables
- Use secrets management for API keys
- Rotate credentials regularly
- Enable audit logging

## 📊 Monitoring & Analytics

### Performance Monitoring

1. **Core Web Vitals:**
   ```javascript
   // Add to main.tsx
   import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
   
   getCLS(console.log);
   getFID(console.log);
   getFCP(console.log);
   getLCP(console.log);
   getTTFB(console.log);
   ```

2. **Error Tracking:**
   ```bash
   # Configure Sentry in .env
   VITE_SENTRY_DSN=your-sentry-dsn
   ```

### Application Monitoring

- **Health Checks:** `/health` endpoint
- **Metrics Collection:** Application performance
- **Log Aggregation:** Centralized logging
- **Uptime Monitoring:** External service monitoring

## 🚀 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9.12.0
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Run quality checks
        run: |
          pnpm lint
          pnpm type-check
          
      - name: Build application
        run: pnpm build
        
      - name: Deploy to Vercel
        uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### GitLab CI

Create `.gitlab-ci.yml`:

```yaml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  image: node:18-alpine
  before_script:
    - corepack enable
    - corepack use pnpm@9.12.0
    - pnpm install --frozen-lockfile
  script:
    - pnpm lint
    - pnpm type-check

build:
  stage: build
  image: node:18-alpine
  before_script:
    - corepack enable
    - corepack use pnpm@9.12.0
    - pnpm install --frozen-lockfile
  script:
    - pnpm build
  artifacts:
    paths:
      - apps/web/dist/

deploy:
  stage: deploy
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
```

## 🔄 Rolling Updates

### Zero-Downtime Deployment

1. **Blue-Green Deployment:**
   ```bash
   # Deploy to green environment
   docker-compose -f docker-compose.green.yml up -d
   
   # Switch traffic
   # Update load balancer configuration
   
   # Remove blue environment
   docker-compose -f docker-compose.blue.yml down
   ```

2. **Rolling Updates with Kubernetes:**
   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: enterprise-app
   spec:
     strategy:
       type: RollingUpdate
       rollingUpdate:
         maxUnavailable: 25%
         maxSurge: 25%
   ```

## 🆘 Troubleshooting

### Common Deployment Issues

**Build fails on deployment:**
- Check Node.js version compatibility
- Verify all dependencies are in `package.json`
- Ensure environment variables are set

**404 errors for routes:**
- Configure server for SPA routing
- Add redirect rules for client-side routing

**Performance issues:**
- Enable gzip compression
- Configure CDN caching
- Optimize bundle size

**SSL certificate issues:**
- Verify certificate validity
- Check certificate chain
- Update security headers

### Health Checks

Add health check endpoint:

```typescript
// In your app
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION
  });
});
```

## 📝 Deployment Checklist

### Pre-Deployment

- [ ] Run quality checks (`pnpm lint`, `pnpm type-check`)
- [ ] Test build locally (`pnpm build`)
- [ ] Update environment variables
- [ ] Review security settings
- [ ] Check external service dependencies

### Post-Deployment

- [ ] Verify application loads correctly
- [ ] Test critical user paths
- [ ] Check error monitoring setup
- [ ] Verify performance metrics
- [ ] Monitor application logs

### Rollback Plan

- [ ] Keep previous deployment ready
- [ ] Document rollback procedure
- [ ] Test rollback process
- [ ] Monitor for issues post-rollback

---

🎉 **Your enterprise React application is now production-ready!**

For additional help, refer to the platform-specific documentation or reach out to the development team.