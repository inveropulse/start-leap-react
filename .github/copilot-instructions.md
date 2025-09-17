# Sedation Solutions Portal - AI Coding Instructions

## Big Picture Architecture

This is a **multi-portal React application** for sedation services management with 4 distinct portals:

- **Internal**: Admin/staff portal (`/internal/*`) - patient/clinic/sedationist management
- **Clinic**: Clinic management portal (`/clinic/*`) - appointments, patient records
- **Patient**: Patient self-service portal (`/patient/*`) - view appointments, records
- **Sedationist**: Provider portal (`/sedationist/*`) - procedure management, diary

### Key Architectural Patterns

- **Portal-based routing**: Routes defined in `src/routes/{portal}_routes.ts` with type-safe route enums
- **Route registry**: `src/routes/registry.ts` centralizes portal configuration and dynamic route generation
- **Domain-driven types**: Organized in `src/shared/types/domains/` by business domain (patient, clinic, sedation, etc.)
- **Generated API client**: Auto-generated from OpenAPI spec using `npm run generate:api`

## Critical Developer Workflows

### API Code Generation

```bash
npm run generate:api  # Regenerates src/api/generated/ from swagger.json
```

⚠️ **Never manually edit** files in `src/api/generated/` - they're overwritten on each generation.

### Build Commands

- `npm run dev` - Development server
- `npm run build:dev` - Development build
- `npm run build` - Production build
- `npm run build:debug` - Debug production build

### Portal Development

When adding new routes to a portal:

1. Add route enum to `src/routes/{portal}_routes.ts`
2. Register component in portal's `ROUTES` array
3. Update portal config in same file
4. Routes auto-register via `src/routes/registry.ts`

## Project-Specific Conventions

### File Organization

- **Barrel exports**: Limited to `src/app/{portal}/index.ts` only - avoid barrel exports in feature/use-case folders
- **Portal-based apps**: `src/app/{portal}/{feature}/{use-case}` - each portal is essentially an individual app
- **Feature naming**: Plural, kebab-case, ideally one word (e.g., `patients`, `appointments`, `clinics`, `dashboard`)
- **Shared components rule**: Components shared between ≥2 adjacent items live in local `/shared/` folders
- **Domain-driven types**: All global types in `src/shared/types/domains/` following DDD principles
- **Modular architecture**: Everything is domain/entity/UI centric for reusability and isolation

### Zustand Store Patterns

```tsx
// Store interface combines state + actions (see auth/store.ts)
interface AuthStore extends AuthState {
  login: (state: AuthState) => void;
  hasPortalAccess: (portal: PortalType) => boolean;
  initializeSecurityListener: () => void; // Security monitoring
}

// Usage via custom hook with utilities
const { isAuthenticated, hasRole, switchPortal } = useAuth();
```

### Portal Access Control

```tsx
// Route protection happens automatically via ProtectedRoute
<ProtectedRoute requiredPortal={PortalType.INTERNAL}>{children}</ProtectedRoute>
```

- Access controlled by `UserRole` enums in portal config
- Portal switching handled by `useAuth()` hook
- No manual permission checks needed in components

### State Management Patterns

- **TanStack Query**: All API calls use React Query patterns
- **Zustand with Security**: Auth store (`src/shared/services/auth/store.ts`) demonstrates advanced patterns:
  - State + actions in single store interface
  - Secure localStorage with encryption/tampering detection
  - Session management with auto-generated session IDs
  - Security event listeners for storage monitoring
- **Portal context**: Current portal state managed by auth service with access control

### UI Component System

- Custom component library in `src/shared/components/ui/`
- **NOT using shadcn/ui** - custom implementations
- Accessibility-first design with dedicated accessibility components
- Animation via Framer Motion for transitions

### Configuration Management

- Environment-aware config in `src/shared/AppConfig.ts`
- Type-safe environment variable handling
- Production vs development feature flags built-in

### Type Organization Strategy

- **src/shared/types/domains/{domain}/**: Domain-driven design - all business types grouped by domain
- **src/shared/types/shared-kernel/**: Cross-domain common types (pagination, API responses, etc.)
- **src/shared/types/ui/**: UI-specific shared types
- **Local types**: Feature-specific types live where they're used (1-2 locations only)
- **Domain entities**: Always live in global types even if used in 1-2 places (e.g., `Patient`, `Clinic`)
- **Domain structure**: Each domain may have `entities/`, `enums/`, `value-objects/` subdirectories as needed

### TypeScript Conventions

- **Use `type` over `interface`**: For entities and data structures
- **Reserve `interface`**: For contracts like component props, services, APIs
- **Request/Response naming**: Suffix with `Request`/`Response` (e.g., `CreatePatientRequest`)
- **API hooks naming**: Suffix with `Request` (e.g., `useCreatePatientRequest`)
- **When in doubt**: Ask before deciding local vs global type placement

### React Component Conventions

- **Functional components only**: Always use functional components with hooks
- **Default exports**: Every React component must use `export default function ComponentName() {}`
- **Component naming**: PascalCase for component names and file names

## Integration Patterns

### API Layer Architecture

```tsx
// TanStack Query + domain-specific endpoints pattern
export const useCreatePatientRequest = () => {
  const { apiClient } = useAxiosClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientsRequestBaseQueryKey });
    },
  });
};
```

- **src/api/generated/**: Auto-generated from swagger - never edit manually
- **src/api/{domain}/**: Domain-specific endpoints grouped by entity for maintainability
- **TanStack Query**: Global reactive state management for all API interactions
- **useAxiosClient**: Centralized HTTP client with interceptors and config
- **Development pattern**: Currently using fake data with commented real API calls for future activation

### Portal Communication

- Portal switching preserves authentication state
- Shared components in `src/shared/` work across all portals
- Portal-specific layouts defined in each portal's components

### Docker Deployment

- Multi-stage build: Node.js build → nginx serve
- Security-hardened with non-root user
- Health check endpoint at `/health`
- Environment variable support for Azure Container Apps

## Essential Commands & Context

```bash
# Regenerate API types after backend changes
npm run generate:api

# Type checking (important before commits)
npm run type-check

# Portal-specific development - check enabled portals in registry
grep -r "enabled.*true" src/routes/
```

Key files for understanding data flow:

- `src/routes/registry.ts` - Portal registration and route generation
- `src/shared/AppConfig.ts` - Environment and feature configuration
- `src/api/generated/ApiClient.ts` - Generated API service methods
- `src/shared/providers/WithProviders.tsx` - Provider composition hierarchy
