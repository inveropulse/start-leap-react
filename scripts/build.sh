#!/bin/bash

# Enterprise React Starter - Production Build Script

echo "🏗️  Building Enterprise React Starter for production..."

# Build shared packages first
echo "📦 Building shared packages..."
pnpm --filter="@company/config" build
pnpm --filter="@company/utils" build  
pnpm --filter="@company/ui" build

# Build web application
echo "🌐 Building web application..."
pnpm --filter="@company/web" build

echo "✅ Build completed successfully!"
echo "📋 Built files are available in apps/web/dist/"