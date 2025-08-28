# 🏥 Sedation Solutions Portal

A comprehensive multi-portal healthcare management system built with modern web technologies and optimized for Azure Container Apps deployment.

## 🌟 Overview

This enterprise-grade platform provides specialized portals for different user types in the sedation healthcare workflow:

- **🔐 Auth Gateway** - Unified authentication and portal routing
- **🏢 Internal Portal** - Staff management and system administration
- **👤 Patient Portal** - Patient-facing appointment and record management
- **💉 Sedationist Portal** - Procedure management and patient monitoring
- **🏥 Clinic Portal** - Clinic operations and staff coordination

## �️ Architecture

### Monorepo Structure

```
├── apps/                          # Portal applications
│   ├── auth-gateway/             # Authentication and routing
│   ├── shared-shell/             # Common UI shell
│   ├── internal-portal/          # Internal staff portal
│   ├── patient-portal/           # Patient-facing portal
│   ├── sedationist-portal/       # Sedationist workflow portal
│   └── clinic-portal/            # Clinic management portal
├── packages/                      # Shared libraries
│   ├── auth/                     # Authentication logic
│   ├── config/                   # Shared configurations
│   ├── medical-types/            # Healthcare data types
│   ├── portal-router/            # Portal switching logic
│   ├── ui/                       # Design system components
│   └── utils/                    # Shared utilities
├── infrastructure/               # Deployment configurations
│   ├── azure/                    # Azure Container Apps configs
│   ├── nginx/                    # Reverse proxy configs
│   ├── database/                 # Database schemas
│   └── monitoring/               # Observability configs
└── tools/                        # Development tools
    ├── scripts/                  # Build and setup scripts
    └── mock-api/                 # Development API server
```

See [Development Guide](docs/DEVELOPMENT.md) for detailed instructions.
