#!/bin/bash

# Enterprise React Starter - Pre-commit Hook
# This script runs quality checks before allowing commits

set -e

echo "🔍 Running pre-commit quality checks..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check for staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|tsx|js|jsx)$' || true)

if [ -z "$STAGED_FILES" ]; then
    print_success "No TypeScript/JavaScript files to check"
    exit 0
fi

print_status "Checking ${#STAGED_FILES[@]} staged files..."

# Run ESLint on staged files
print_status "Running ESLint..."
if ! pnpm lint $STAGED_FILES; then
    print_error "ESLint failed. Please fix the issues and try again."
    echo "💡 Tip: Run 'pnpm lint --fix' to auto-fix some issues"
    exit 1
fi
print_success "ESLint passed"

# Run TypeScript type checking
print_status "Running TypeScript type check..."
if ! pnpm type-check; then
    print_error "TypeScript type check failed. Please fix the issues and try again."
    exit 1
fi
print_success "TypeScript type check passed"

# Check for console.log statements (warn only)
CONSOLE_LOGS=$(grep -rn "console\.log" $STAGED_FILES || true)
if [ ! -z "$CONSOLE_LOGS" ]; then
    echo -e "${YELLOW}⚠️  Warning: Found console.log statements:${NC}"
    echo "$CONSOLE_LOGS"
    echo -e "${YELLOW}💡 Consider removing console.log statements before committing${NC}"
fi

# Check for TODO comments (info only)
TODOS=$(grep -rn "TODO\|FIXME\|HACK" $STAGED_FILES || true)
if [ ! -z "$TODOS" ]; then
    echo -e "${BLUE}ℹ️  Found TODO/FIXME comments:${NC}"
    echo "$TODOS"
fi

print_success "🎉 All pre-commit checks passed!"
exit 0