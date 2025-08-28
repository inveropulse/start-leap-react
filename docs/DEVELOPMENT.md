# Development Guide

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ 
- **pnpm** 9.12.0+ (installed via corepack)
- **Git** for version control

### Quick Setup

1. **Clone and setup:**
   ```bash
   git clone <repository-url>
   cd enterprise-react-starter
   chmod +x tools/scripts/setup.sh
   ./tools/scripts/setup.sh
   ```

2. **Start development:**
   ```bash
   pnpm dev
   ```

3. **Open in browser:**
   http://localhost:3000

## 🏗️ Architecture

### Monorepo Structure

```
enterprise-react-starter/
├── apps/
│   └── web/                 # Main React application
├── packages/
│   ├── config/             # Shared configurations (ESLint, Tailwind, etc.)
│   ├── ui/                 # Shared UI components
│   └── utils/              # Shared utilities & logging
├── tools/
│   └── scripts/            # Development scripts & generators
└── docs/                   # Documentation
```

### Tech Stack

- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** TanStack Query + React Router
- **Monorepo:** pnpm workspaces + NX
- **Quality:** ESLint + TypeScript + Pre-commit hooks

## 🛠️ Development Workflow

### Daily Development

```bash
# Start dev server (all packages)
pnpm dev

# Build specific package
pnpm --filter="@company/ui" build

# Run tests
pnpm test

# Type checking
pnpm type-check

# Lint & fix
pnpm lint --fix
```

### Creating Components

```bash
# Generate new component in UI package
node tools/scripts/generators/component.js MyComponent
```

### Package Commands

```bash
# Install dependency in specific package
pnpm --filter="@company/web" add react-query

# Run command in all packages
pnpm --filter="@company/*" build

# Run command in specific workspace
pnpm --filter="@company/ui" dev
```

## 🎨 Design System

### Using Design Tokens

Always use semantic tokens from `index.css`:

```tsx
// ❌ Don't use direct colors
<div className="bg-blue-500 text-white">

// ✅ Use semantic tokens
<div className="bg-enterprise-primary text-primary-foreground">
```

### Component Variants

Create variants in components instead of inline styles:

```tsx
// In component definition
const buttonVariants = cva(
  "base-styles",
  {
    variants: {
      variant: {
        enterprise: "bg-gradient-enterprise text-white shadow-enterprise"
      }
    }
  }
)

// Usage
<Button variant="enterprise">Click me</Button>
```

### Available Design Tokens

```css
/* Enterprise Colors */
--enterprise-primary: 220 91% 48%;
--enterprise-secondary: 259 84% 60%;

/* Gradients */
--gradient-enterprise: linear-gradient(...);
--gradient-surface: linear-gradient(...);

/* Shadows */
--shadow-enterprise: 0 4px 20px hsl(var(--enterprise-primary) / 0.15);
--shadow-elegant: 0 10px 30px -10px hsl(var(--primary) / 0.1);
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Application
VITE_APP_NAME="Your App Name"
VITE_API_BASE_URL=http://localhost:3001

# Features
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
```

### TypeScript

Each package has its own `tsconfig.json` with project references:

```json
{
  "extends": "@company/config/typescript",
  "references": [
    { "path": "../../packages/ui" }
  ]
}
```

### ESLint

Shared ESLint config with enterprise-grade rules:

```js
// Extends from packages/config/eslint.config.js
export default createESLintConfig({
  // Custom overrides
});
```

## 📦 Build & Deployment

### Development Build

```bash
# Build all packages
pnpm build

# Analyze bundle size
./tools/scripts/build-analyze.sh
```

### Production Build

```bash
# Docker build
docker build -t enterprise-app .

# Docker compose (full stack)
docker-compose up -d
```

### Build Optimization

- **Code Splitting:** Automatic with Vite
- **Tree Shaking:** Enabled by default
- **Bundle Analysis:** Run `./tools/scripts/build-analyze.sh`

## 🧪 Testing Strategy

### Unit Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

### Type Safety

```bash
# Type check all packages
pnpm type-check

# Type check specific package
pnpm --filter="@company/web" type-check
```

## 🔍 Debugging

### Development Tools

- **React DevTools:** Browser extension
- **TanStack Query DevTools:** Included in dev mode
- **Vite DevTools:** Built-in HMR and error overlay

### Logging

Use the centralized logger:

```tsx
import { logger } from '@company/utils';

logger.info('User action', {
  component: 'MyComponent',
  action: 'button_click',
  userId: user.id
});
```

### Error Boundaries

Errors are automatically caught and logged:

```tsx
// Wrapped automatically in App.tsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

## 🚀 Performance

### Best Practices

1. **Lazy Loading:**
   ```tsx
   const LazyComponent = lazy(() => import('./MyComponent'));
   ```

2. **Code Splitting:**
   ```tsx
   const routes = [
     {
       path: '/dashboard',
       component: lazy(() => import('./Dashboard'))
     }
   ];
   ```

3. **Memoization:**
   ```tsx
   const MemoizedComponent = memo(MyComponent);
   const memoizedValue = useMemo(() => calculation, [deps]);
   ```

### Performance Monitoring

- Bundle size analysis with `build-analyze.sh`
- Runtime performance with React DevTools Profiler
- Core Web Vitals monitoring (configure in `.env`)

## 🔒 Security

### Environment Security

- Never commit `.env` files
- Use environment-specific configurations
- Validate environment variables at runtime

### Code Security

- ESLint security rules enabled
- TypeScript strict mode
- Input validation with Zod schemas

### Production Security

- Security headers in Nginx config
- Content Security Policy configured
- HTTPS enforcement in production

## 📝 Contributing

### Code Style

- Use TypeScript strictly
- Follow ESLint rules
- Use semantic commit messages
- Write self-documenting code

### Pre-commit Hooks

Automatically runs:
- ESLint
- TypeScript checking
- Tests (if configured)

### Pull Request Process

1. Create feature branch
2. Make changes
3. Run quality checks: `pnpm lint && pnpm type-check`
4. Commit with semantic messages
5. Create pull request

## 🆘 Troubleshooting

### Common Issues

**pnpm install fails:**
```bash
# Clear cache and reinstall
pnpm store prune
rm -rf node_modules
pnpm install
```

**TypeScript errors in IDE:**
```bash
# Restart TypeScript server
# VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
```

**Build fails:**
```bash
# Clean build
rm -rf apps/web/dist packages/*/dist
pnpm build
```

### Getting Help

1. Check this documentation
2. Review error logs in console
3. Check GitHub issues
4. Ask team members

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [pnpm Workspaces](https://pnpm.io/workspaces)