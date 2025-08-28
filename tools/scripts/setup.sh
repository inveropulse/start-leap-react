#!/bin/bash

# Enterprise React Starter - Setup Script
# This script sets up the development environment for new developers

set -e

echo "🚀 Setting up Enterprise React Starter..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check system requirements
print_status "Checking system requirements..."

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node --version | sed 's/v//')
REQUIRED_VERSION="18.0.0"
if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    print_error "Node.js version $NODE_VERSION is too old. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi
print_success "Node.js version $NODE_VERSION ✓"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    print_warning "pnpm is not installed. Installing pnpm..."
    corepack enable
    corepack use pnpm@9.12.0
    if ! command -v pnpm &> /dev/null; then
        print_error "Failed to install pnpm. Please install manually: npm install -g pnpm"
        exit 1
    fi
fi
print_success "pnpm $(pnpm --version) ✓"

# Check Git
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git from https://git-scm.com"
    exit 1
fi
print_success "Git $(git --version | cut -d' ' -f3) ✓"

# Install dependencies
print_status "Installing dependencies..."
if [ ! -d "node_modules" ]; then
    pnpm install --frozen-lockfile
    print_success "Dependencies installed"
else
    print_warning "Dependencies already installed. Run 'pnpm install' to update."
fi

# Copy environment file
print_status "Setting up environment configuration..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    print_success "Created .env file from .env.example"
    print_warning "Please review and update the .env file with your configuration"
else
    print_warning ".env file already exists"
fi

# Build shared packages
print_status "Building shared packages..."
pnpm --filter="@company/config" build
pnpm --filter="@company/utils" build  
pnpm --filter="@company/ui" build
print_success "Shared packages built"

# Run type check
print_status "Running type check..."
pnpm --filter="@company/web" type-check
print_success "Type check passed"

# Setup git hooks (if .git exists)
if [ -d ".git" ]; then
    print_status "Setting up git hooks..."
    
    # Create pre-commit hook
    mkdir -p .git/hooks
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh
# Enterprise React Starter - Pre-commit hook

echo "🔍 Running pre-commit checks..."

# Run linting
pnpm lint
if [ $? -ne 0 ]; then
    echo "❌ Linting failed. Please fix the issues and try again."
    exit 1
fi

# Run type check
pnpm type-check
if [ $? -ne 0 ]; then
    echo "❌ Type check failed. Please fix the issues and try again."
    exit 1
fi

echo "✅ Pre-commit checks passed!"
EOF
    
    chmod +x .git/hooks/pre-commit
    print_success "Git hooks configured"
fi

# Create helpful aliases
print_status "Creating helpful development commands..."
cat > scripts/dev-commands.sh << 'EOF'
#!/bin/bash
# Development helper commands

# Quick start development
alias dev-start="pnpm dev"

# Quick build all packages
alias dev-build="pnpm --filter='@company/*' build"

# Quick type check
alias dev-check="pnpm type-check"

# Quick lint fix
alias dev-lint="pnpm lint --fix"

# Generate new component
alias dev-component="node tools/scripts/generators/component.js"

# Quick clean (removes node_modules and builds)
alias dev-clean="rm -rf node_modules apps/*/node_modules packages/*/node_modules && rm -rf apps/*/dist packages/*/dist"

echo "Development commands loaded! Available aliases:"
echo "  dev-start    - Start development server"
echo "  dev-build    - Build all packages"  
echo "  dev-check    - Run type checking"
echo "  dev-lint     - Run linting with auto-fix"
echo "  dev-component <name> - Generate new component"
echo "  dev-clean    - Clean all dependencies and builds"
EOF

chmod +x scripts/dev-commands.sh
print_success "Development commands created (run 'source scripts/dev-commands.sh' to load them)"

print_success "🎉 Setup completed successfully!"
print_status "Next steps:"
echo "  1. Review and update the .env file"
echo "  2. Run 'pnpm dev' to start the development server"
echo "  3. Open http://localhost:3000 in your browser"
echo "  4. Read the documentation in docs/README.md"
print_status "Happy coding! 🚀"