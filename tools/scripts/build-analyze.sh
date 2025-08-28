#!/bin/bash

# Enterprise React Starter - Build Analysis Script
# Analyzes bundle size, dependencies, and performance

set -e

echo "📊 Analyzing build performance..."

# Colors
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

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Build the application
print_status "Building application for analysis..."
pnpm build

# Check if build directory exists
if [ ! -d "apps/web/dist" ]; then
    echo "❌ Build directory not found. Build may have failed."
    exit 1
fi

# Analyze bundle sizes
print_status "Analyzing bundle sizes..."

# Check main bundle size
MAIN_JS=$(find apps/web/dist/assets -name "index-*.js" | head -1)
MAIN_CSS=$(find apps/web/dist/assets -name "index-*.css" | head -1)

if [ -f "$MAIN_JS" ]; then
    MAIN_JS_SIZE=$(du -h "$MAIN_JS" | cut -f1)
    echo "📦 Main JavaScript bundle: $MAIN_JS_SIZE"
    
    # Check if bundle is too large (warn if > 500KB)
    MAIN_JS_BYTES=$(stat -f%z "$MAIN_JS" 2>/dev/null || stat -c%s "$MAIN_JS")
    if [ "$MAIN_JS_BYTES" -gt 512000 ]; then
        print_warning "Main JavaScript bundle is large (${MAIN_JS_SIZE}). Consider code splitting."
    fi
fi

if [ -f "$MAIN_CSS" ]; then
    MAIN_CSS_SIZE=$(du -h "$MAIN_CSS" | cut -f1)
    echo "🎨 Main CSS bundle: $MAIN_CSS_SIZE"
fi

# Count total assets
TOTAL_ASSETS=$(find apps/web/dist/assets -type f | wc -l)
echo "📄 Total assets: $TOTAL_ASSETS files"

# Calculate total size
TOTAL_SIZE=$(du -sh apps/web/dist | cut -f1)
echo "💾 Total build size: $TOTAL_SIZE"

# Check for unused dependencies (requires npm-check-unused if available)
print_status "Checking for potential optimizations..."

# Check for large dependencies
print_status "Analyzing dependencies..."
echo "📊 Top 10 largest dependencies:"

# Parse package.json to show dependency sizes (approximation)
if command -v npm &> /dev/null && command -v du &> /dev/null; then
    cd apps/web
    for pkg in $(npm list --depth=0 --parseable 2>/dev/null | head -10); do
        if [ -d "$pkg" ]; then
            size=$(du -sh "$pkg" 2>/dev/null | cut -f1 || echo "?")
            name=$(basename "$pkg")
            echo "  $name: $size"
        fi
    done
    cd ../..
fi

# Suggestions
print_status "💡 Optimization suggestions:"
echo "  • Enable gzip compression in production"
echo "  • Consider lazy loading for routes and components" 
echo "  • Use dynamic imports for large dependencies"
echo "  • Optimize images and use modern formats (WebP, AVIF)"
echo "  • Remove unused CSS with PurgeCSS"

# Performance budget check
print_status "Performance budget check:"
BUDGET_JS=500000  # 500KB
BUDGET_CSS=100000 # 100KB

if [ -f "$MAIN_JS" ]; then
    MAIN_JS_BYTES=$(stat -f%z "$MAIN_JS" 2>/dev/null || stat -c%s "$MAIN_JS")
    if [ "$MAIN_JS_BYTES" -le "$BUDGET_JS" ]; then
        print_success "JavaScript bundle within budget (${MAIN_JS_SIZE})"
    else
        print_warning "JavaScript bundle exceeds budget (${MAIN_JS_SIZE} > 500KB)"
    fi
fi

if [ -f "$MAIN_CSS" ]; then
    MAIN_CSS_BYTES=$(stat -f%z "$MAIN_CSS" 2>/dev/null || stat -c%s "$MAIN_CSS")
    if [ "$MAIN_CSS_BYTES" -le "$BUDGET_CSS" ]; then
        print_success "CSS bundle within budget (${MAIN_CSS_SIZE})"
    else
        print_warning "CSS bundle exceeds budget (${MAIN_CSS_SIZE} > 100KB)"
    fi
fi

print_success "📊 Build analysis complete!"
echo "🚀 Build artifacts are ready in apps/web/dist/"