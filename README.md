# 🚀 Enterprise React Starter

A production-ready, enterprise-grade React monorepo starter with modern tooling and comprehensive developer experience.

## ✨ Features

- 🏗️ **Monorepo Architecture** - PNPM workspaces + NX orchestration
- ⚡ **Modern Stack** - React 18, TypeScript, Vite, Tailwind CSS  
- 🎨 **Design System** - shadcn/ui with enterprise theming
- 📝 **Centralized Logging** - Structured logging with external services
- 🛡️ **Error Boundaries** - Comprehensive error handling
- 🔧 **Developer Tools** - Generators, linting, hot reload
- 🐳 **Production Ready** - Docker, security, optimization

## 🏁 Quick Start

```bash
# Setup and start
chmod +x tools/scripts/setup.sh
./tools/scripts/setup.sh
pnpm dev
```

Open http://localhost:3000

## 🛠️ Development

```bash
pnpm dev                    # Start development
pnpm build                  # Build for production
pnpm lint                   # Code quality check
pnpm type-check            # TypeScript validation

# Code generation
node tools/scripts/generators/component.js MyComponent
node tools/scripts/generators/page.js MyPage
node tools/scripts/generators/hook.js myHook
```

## 📁 Architecture

```
apps/web/              # Main React app
packages/
  ├── config/          # Shared configurations
  ├── ui/              # UI component library  
  └── utils/           # Shared utilities
tools/scripts/         # Development tools
docs/                  # Documentation
```

See [Development Guide](docs/DEVELOPMENT.md) for detailed instructions.