# Enterprise React Starter

A production-ready monorepo template with enterprise-grade tooling, centralized logging, error boundaries, and beautiful design system.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## 📁 Project Structure

```
enterprise-react-starter/
├── apps/
│   └── web/                 # Main React application
├── packages/
│   ├── config/              # Shared configurations
│   ├── ui/                  # Design system & components
│   └── utils/               # Shared utilities & logging
├── tools/
│   ├── scripts/             # Build & deployment scripts
│   └── generators/          # Code generators
├── docker/                  # Docker configurations
└── docs/                    # Documentation
```

## 🎯 Features

### Enterprise Architecture
- **Monorepo Structure**: PNPM workspaces with Nx for scalable development
- **Shared Configurations**: Centralized TypeScript, ESLint, Vite configs
- **Type Safety**: Full TypeScript coverage across all packages

### Error Handling & Monitoring
- **Error Boundaries**: Comprehensive React error boundaries with recovery
- **Centralized Logging**: Structured logging with external service integration
- **Performance Monitoring**: Built-in performance tracking

### Design System
- **Component Library**: Beautiful, accessible components with variants
- **Theme System**: Enterprise-grade design tokens and color system
- **Responsive Design**: Mobile-first responsive components

### DevOps Ready
- **Docker Support**: Multi-stage production builds
- **CI/CD Ready**: GitHub Actions workflows included
- **Security Headers**: Production-ready security configurations

## 📚 Documentation

- [Getting Started](./getting-started.md)
- [Architecture](./architecture.md)
- [Deployment](./deployment.md)
- [Contributing](./contributing.md)

## 🔧 Development

### Prerequisites
- Node.js 22+
- pnpm 9.12.0+

### Available Scripts
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run linting
- `pnpm type-check` - Run TypeScript checks

## 🏗️ Architecture

This monorepo follows enterprise best practices:

1. **Separation of Concerns**: Clear boundaries between packages
2. **Dependency Management**: Shared dependencies at root level
3. **Build Optimization**: Incremental builds with caching
4. **Code Sharing**: Reusable utilities and components

## 📈 Logging & Monitoring

The integrated logging system provides:

- **Structured Logging**: JSON-formatted logs with context
- **External Service Integration**: Easy integration with Sentry, DataDog, etc.
- **Performance Tracking**: Automatic performance metrics
- **Error Reporting**: Comprehensive error tracking and reporting

## 🚀 Deployment

### Docker Deployment
```bash
# Build production image
docker build -t enterprise-react-starter .

# Run container
docker run -p 80:80 enterprise-react-starter
```

### Environment Configuration
The application supports multiple deployment environments with proper configuration management.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.