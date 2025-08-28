#!/bin/bash

# Enterprise React Starter - Development Script

echo "🚀 Starting Enterprise React Starter in development mode..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please run: corepack enable && corepack use pnpm@9.12.0"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
fi

# Build shared packages in watch mode
echo "🔧 Building shared packages..."
pnpm --filter="@company/config" build &
pnpm --filter="@company/utils" build &
pnpm --filter="@company/ui" build &

# Wait for packages to build
sleep 3

# Start the web application
echo "🌐 Starting web application..."
pnpm --filter="@company/web" dev