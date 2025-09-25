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

### Business Process Context

**Sedation Solutions Appointment Workflow**: Understanding the core business process is essential for domain modeling:

**The Booking Flow**:

1. **Clinic Contact** (receptionist/doctor assistant/clinic doctor) calls Sedation Solutions office
2. **Existing Clinic** - Caller represents a clinic already registered in our database/records
3. **Appointment Request** - Request booking for their **patient** to undergo a sedation procedure
4. **Doctor Recommendation** - Patient's **doctor** (at clinic) may have made the procedure recommendation
5. **Internal Booking** - Sedation Solutions team creates the appointment in our system
6. **Sedationist Assignment** - **Critical step** - assign available sedationist to the appointment

**Entity Relationships in Process**:

- **Clinics** = Our **clients/customers** who book appointments for their patients
- **Patients** = Belong to **clinics** (have patient files/records at the clinic)
- **Sedationists** = **Internal Sedation Solutions staff** who perform procedures
- **Appointments** = Central booking entity connecting all parties

**Key Business Rules**:

- **Sedationist-Appointment**: 1:many (one sedationist handles multiple appointments)
- **Appointment-Sedationist**: 1:1 (each appointment gets exactly one assigned sedationist)
- **Specialty Matching**: Ideally match sedationist specialties to procedure types, but **flexible assignment** allowed for operational needs
- **Availability System**: Critical for preventing double-booking and calendar integration
- **Assignment Workflow**: Used to find available sedationists for specific appointment time slots

**Availability Management**:
Sedationist availability tracks when staff are **unavailable** for appointments due to:

- Meetings, sick leave, holidays, workshops, personal reasons
- Shows on calendar alongside appointments
- Prevents scheduling conflicts during assignment process

This workflow directly influences domain design patterns, relation entities, and API requirements across patient/clinic/sedationist/appointment domains.

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

## Domain-Driven Design Patterns (PRIORITY)

### User Entity Pattern (CRITICAL - Security & Management)

**User entities follow a dual-context pattern for security and management**:

```tsx
// Shared base fields for DRY principles
export type BaseUserFields = {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phone?: string;
  department?: Department;
  permissionLevel?: PermissionLevel;
  status: UserStatus;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};

// Shared portal access configuration
export type UserPortalAccess = {
  [PortalType.CLINIC]: boolean;
  [PortalType.INTERNAL]: boolean;
  [PortalType.PATIENT]: boolean;
  [PortalType.SEDATIONIST]: boolean;
};

// Readonly session user - completely immutable for security
export type AuthenticatedUser = Readonly<BaseUserFields> & {
  readonly id: string;
  readonly fullName: string;
  readonly avatar?: string;
  readonly lastLoginDate?: string;
  readonly lastPasswordChangeDate?: string;
  readonly portalAccess: Readonly<UserPortalAccess>;
};

// Mutable management user - for admin operations
export type ManageableUser = BaseUserFields & {
  id: string; // Required for management operations
  fullName?: string; // Computed field
  avatar?: string;
  lastLoginDate?: string;
  lastPasswordChangeDate?: string;
  portalAccess?: UserPortalAccess; // Mutable configuration
};
```

**Key User Entity Rules (NON-NEGOTIABLE)**:

- **AuthenticatedUser**: Current session user - completely readonly for security
- **ManageableUser**: User management operations - mutable with required `id`
- **BaseUserFields**: Shared foundation eliminating duplication
- **Context separation**: Authentication vs management are distinct domains
- **Portal access**: Readonly in session context, mutable in management context
- **Never use generic "User" type** - always specify the context

### Entity Structure Pattern (Standard)

**Every domain follows consistent Base + Extended pattern**:

```tsx
// Base fields - core business data only
export type BasePatientFields = {
  firstName: string;
  lastName: string;
  // ... core business fields
};

// Extended entity with computed/system fields
export type Patient = Partial<BasePatientFields> & {
  id?: string;
  fullName?: string; // Computed fields
  createdDateTime?: string; // System fields
};
```

### Relation Entity Pattern

**Use minimal display data to avoid circular dependencies**:

```tsx
export type PatientAppointment = {
  patientId: string;
  appointmentId: string;
  // Minimal display data to avoid extra API calls
  patientFullName?: string;
  appointmentDateTime?: string;
  clinicName?: string;
  status: "scheduled" | "confirmed" | "completed";
};
```

### Enum Conventions

- **Human-readable values**: All enum values must be UI-ready strings for direct display
- **No magic numbers/strings**: Always use proper enums instead of magic values
- **Consistent formatting**: Apply same pattern across all domains

```tsx
// ✅ CORRECT - Direct UI display
export enum PatientStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  ON_LEAVE = "On Leave",
}

// ❌ WRONG - Requires transformation
export enum PatientStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  ON_LEAVE = "on_leave",
}

// ❌ WRONG - Magic number
dayOfWeek: number; // 0 = Sunday, 1 = Monday

// ✅ CORRECT - Proper enum
dayOfWeek: DayOfWeek;
export enum DayOfWeek {
  SUNDAY = "Sunday",
  MONDAY = "Monday",
}
```

**Cross-Domain Consistency**: When updating patterns in one domain (patient/clinic/sedationist), apply consistently to all domains for maintainability.

**Enum Utilities**: Use centralized enum utilities for UI integration:

```tsx
import { enumToOptions } from "@/shared/utils/enum-utils";

// Convert any enum to dropdown options
const statusOptions = enumToOptions(PatientStatus);
// Returns: [{ label: "Active", value: "Active" }, ...]
```

### TypeScript Conventions

- **Use `type` over `interface`**: For entities and data structures
- **Reserve `interface`**: For contracts like component props, services, APIs
- **Request/Response naming**: Suffix with `Request`/`Response` (e.g., `CreatePatientRequest`)
- **API hooks naming**: Suffix with `Request` (e.g., `useCreatePatientRequest`)
- **User entity contexts**: Always use `AuthenticatedUser` for session, `ManageableUser` for admin operations
- **Base + Extended pattern**: Use `Base{Entity}Fields` for shared foundations across domains
- **When in doubt**: Ask before deciding local vs global type placement

### React Component Conventions

- **Functional components only**: Always use functional components with hooks
- **Default exports**: Every React component must use `export default function ComponentName() {}`
- **Component naming**: PascalCase for component names and file names

## SOLID Principles & Component Architecture (PRIORITY)

### Epic/Use-Case Directory Structure (REQUIRED)

**Apply consistent epic/use-case structure across all feature modules**:

```
src/app/{portal}/{feature}/
├── {FeaturePage}.tsx           # Main container component
├── {use-case-1}/               # Individual use cases
│   ├── {UseCase}Component.tsx  # ✅ MAIN COMPONENT - Entry point
│   ├── components/             # ✅ Smaller broken-down components
│   │   ├── {Subcomponent}.tsx  # Specialized components
│   │   ├── steps/              # For multi-step forms
│   │   │   ├── Step1.tsx
│   │   │   └── Step2.tsx
│   │   ├── FormConfig.ts       # Configuration/constants
│   │   └── index.ts            # Barrel export
│   ├── hooks/
│   │   ├── use{UseCase}.ts     # Business logic hook
│   │   └── index.ts            # Barrel export
│   └── types/
│       └── index.ts            # Use-case specific types
├── {use-case-2}/               # Another use case
│   ├── {UseCase}Component.tsx  # ✅ Main component entry point
│   └── components/             # Broken-down components
└── shared/                     # Shared between use cases
    └── components/
        ├── {Feature}Avatar.tsx # Reusable components
        ├── {Feature}Badge.tsx  # Display components
        └── index.ts            # Barrel export
```

**Key Structure Rules (CRITICAL)**:

- **Main Component Location**: Entry point component lives directly in use-case folder (`/create/CreateUserModal.tsx`)
- **Broken-Down Components**: Smaller specialized components live in `/components` subfolder
- **Component Decomposition**: Break complex components into focused, single-responsibility pieces
- **Configuration Separation**: Extract constants, schemas, and options into separate files
- **Step Components**: For multi-step workflows, create dedicated step components in `/steps` subfolder

**Component Organization Examples**:

```tsx
// ✅ CORRECT - Main component as entry point
/create/CreateUserModal.tsx         // Main orchestrating component

// ✅ CORRECT - Broken-down specialized components
/create/components/StepNavigation.tsx    // Step indicator
/create/components/StepContent.tsx       // Content router
/create/components/FormConfig.ts         // Schema/options
/create/components/steps/BasicInfo.tsx   # Individual steps

// ❌ WRONG - Everything in one monolithic file
/create/CreateUserModal.tsx         // 500+ lines handling everything

// ❌ WRONG - Main component buried in subfolder
/create/components/CreateUserModal.tsx   // Entry point should be at use-case root
```

**Use-Case Naming Convention**:

- **view-all**: List/table views with search, pagination, filtering
- **create**: Creation forms and modals
- **profile**: Detail views and profile pages
- **shared**: Reusable components between use cases

### High Cohesion Component Pattern (CRITICAL)

**Components should handle their own data fetching and state management**:

```tsx
// ✅ CORRECT - High cohesion component
export default function ListViewStats() {
  const { data: stats, isPending, error } = useGetUsersStatsRequest();

  // Component handles its own loading states, errors, and rendering
  if (isPending) return <LoadingSkeleton />;
  if (error) return <ErrorState />;

  return <StatsDisplay stats={stats?.data} />;
}

// ❌ WRONG - External data dependency
export default function ListViewStats({ stats, isLoading }) {
  // Relies on parent for data management
}
```

**High Cohesion Rules (NON-NEGOTIABLE)**:

- Components responsible for their own API calls when possible
- Self-contained loading and error states
- Minimal external dependencies for data
- Clear single responsibility

### Use-Case Specific Hooks (REQUIRED)

**Encapsulate all business logic in use-case specific hooks**:

```tsx
// Hook structure for use cases
export const useViewAllUsers = () => {
  // API calls
  const usersQuery = useFindAllUsersRequest(searchParams);
  const statsQuery = useGetUsersStatsRequest();

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Computed state
  const hasUsers = users.length > 0;
  const hasSelection = selectedIds.length > 0;

  // Actions object
  const actions = {
    handleSearch: (query: string) => {
      /* logic */
    },
    selectAll: () => {
      /* logic */
    },
    clearSelection: () => {
      /* logic */
    },
  };

  return {
    state: { users, searchQuery, selectedIds, hasUsers, isLoading },
    actions,
  };
};
```

**Use-Case Hook Rules**:

- **Naming**: `use{UseCase}` (e.g., `useViewAllUsers`, `useCreateUser`)
- **Return structure**: `{ state, actions }` object pattern
- **Encapsulation**: All business logic, API calls, and state management
- **Separation**: Prevents logic leakage between use cases

### SOLID Principles Implementation

#### Single Responsibility Principle ✅

**Each component has exactly one reason to change**:

```tsx
// UserAvatar - only handles avatar display
export default function UserAvatar({ user, size = "md" }) {
  const getInitials = (user) => {
    /* avatar logic only */
  };
  return <Avatar>{/* avatar rendering only */}</Avatar>;
}

// UserStatusBadge - only handles status visualization
export default function UserStatusBadge({ status }) {
  const getStatusConfig = (status) => {
    /* status styling only */
  };
  return <Badge>{/* status display only */}</Badge>;
}
```

#### Open/Closed Principle ✅

**Components extensible without modification**:

```tsx
// UserActions - extensible with custom actions
export default function UserActions({
  user,
  onEdit,
  onDelete,
  customActions = [], // Extension point
}) {
  return (
    <DropdownMenu>
      {/* Standard actions */}
      <DropdownMenuItem onClick={() => onEdit(user)}>Edit</DropdownMenuItem>

      {/* Custom actions without modifying component */}
      {customActions.map((action) => (
        <DropdownMenuItem onClick={() => action.onClick(user)}>
          {action.label}
        </DropdownMenuItem>
      ))}
    </DropdownMenu>
  );
}

// UserDataTable - configurable columns
export default function UserDataTable({
  users,
  customColumns = [], // Extension point
  onUserAction,
}) {
  const allColumns = [...defaultColumns, ...customColumns];
  // Table renders all columns without modification
}
```

**Extension Point Patterns**:

- `customActions` prop for additional dropdown actions
- `customColumns` prop for additional table columns
- `onUserAction` callback for flexible action handling
- Higher-order component patterns where appropriate

#### Dependency Inversion Principle ✅

**Depend on abstractions, not concretions**:

```tsx
// ViewAllUsers depends on hook abstraction
export default function ViewAllUsers({ onAddUser }) {
  const { state, actions } = useViewAllUsers(); // Abstract hook interface

  // Component doesn't know about specific API calls or state management
  return (
    <div>
      <UserDataTable
        users={state.users}
        onUserAction={actions.handleUserAction} // Abstract action interface
      />
    </div>
  );
}
```

### Component Reusability Patterns

#### Balanced Granularity (CRITICAL)

**Avoid both monolithic components and excessive micro-components**:

```tsx
// ✅ CORRECT - Balanced reusable component
export default function UserActions({ user, customActions, onEdit, onDelete }) {
  // Handles complete dropdown logic with extension points
}

// ❌ WRONG - Too granular
export default function DropdownTriggerButton() {
  return (
    <Button>
      <MoreHorizontal />
    </Button>
  );
}

// ❌ WRONG - Too monolithic
export default function UserManagementSection() {
  // Handles list, create modal, actions, stats all in one component
}
```

#### Shared Component Strategy

**Components shared between ≥2 use cases go in `/shared/` folder**:

```
users/shared/components/
├── UserAvatar.tsx      # Used in list, create, profile
├── UserStatusBadge.tsx # Used in list, profile
├── UserRoleBadge.tsx   # Used in list, create
└── UserDataTable.tsx   # Used in different list views
```

### Business Logic Separation (REQUIRED)

#### Hook-Based Logic Isolation

**Separate business logic from UI rendering**:

```tsx
// ✅ CORRECT - Logic in hook, UI in component
const CreateUserModal = ({ isOpen, onClose }) => {
  const { formData, errors, updateField, submitForm } = useCreateUser();

  return (
    <Dialog open={isOpen}>
      <form onSubmit={submitForm}>
        <Input
          value={formData.firstName}
          onChange={(e) => updateField("firstName", e.target.value)}
        />
      </form>
    </Dialog>
  );
};

// ❌ WRONG - Business logic mixed with UI
const CreateUserModal = ({ isOpen, onClose }) => {
  const [firstName, setFirstName] = useState("");
  const [errors, setErrors] = useState({});
  const createMutation = useCreateUserRequest();

  const validateForm = () => {
    /* validation logic in component */
  };
  const handleSubmit = async () => {
    /* submission logic in component */
  };

  // UI rendering mixed with business logic
};
```

#### Type Organization for Use Cases

**Local types for use-case specific concerns**:

```tsx
// Local types in use-case types folder
export type ViewAllUsersState = {
  users: ManageableUser[];
  searchQuery: string;
  selectedUserIds: string[];
  // ... view-specific state
};

export type ViewAllUsersActions = {
  handleSearch: (query: string) => void;
  selectUser: (id: string) => void;
  // ... view-specific actions
};

// Global types still in shared/types/domains/
export type ManageableUser = BaseUserFields & {
  id: string;
  // ... domain entity
};
```

## API Layer Architecture (PRIORITY)

### Domain Organization Pattern (REQUIRED)

```tsx
// File structure for each domain
src/api/{domain}/
  ├── types.ts          // Domain-specific API types
  ├── mockData.ts       // Fake data for development
  ├── create.ts         // Create operations
  ├── findAll.ts        // List/search operations
  ├── findById.ts       // Single entity fetch
  ├── update.ts         // Update operations
  ├── delete.ts         // Delete operations
  └── stats.ts          // Statistics/aggregations
```

### API Types Pattern (CRITICAL)

```tsx
// Domain-specific API types following established patterns
export type CreateUserRequest = BaseUserFields & {
  sendWelcomeEmail?: boolean; // Operation-specific additions
};

export type UpdateUserRequest = ManageableUser; // Full entity for updates

export type UserSearchParams = Omit<SearchParams, "sortBy"> & {
  sortBy?: keyof ManageableUser; // Domain-specific sorting
  status?: UserStatus[];
  roles?: UserRole[];
  departments?: Department[];
};

export type FindAllUsersResponse = ApiPaginationResponse<ManageableUser>;
```

### TanStack Query Integration (REQUIRED)

```tsx
// Consistent query patterns across domains
export const useFindAllUsersRequest = (params: UserSearchParams) => {
  const { apiClient } = useAxiosClient();
  return useQuery({
    queryKey: [...USERS_REQUEST_BASE_QUERY_KEY, params],
    queryFn: async (): Promise<FindAllUsersResponse> => {
      // Fake data with network delay for realistic UX
      await new Promise((resolve) => setTimeout(resolve, 500));
      return fetchFakeAllUsers(params);
      // return apiClient.users.findAllUsers(params); // Real API (commented)
    },
    staleTime: 5 * 60 * 1000, // Domain-appropriate cache duration
  });
};

// Consistent mutation patterns with cache invalidation
export const useCreateUserRequest = () => {
  const queryClient = useQueryClient();
  const { apiClient } = useAxiosClient();

  return useMutation({
    mutationKey: ["create.user.request"], // Descriptive mutation keys
    onSuccess: () => {
      // Always invalidate related queries for cache consistency
      queryClient.invalidateQueries({
        queryKey: [...USERS_REQUEST_BASE_QUERY_KEY],
      });
    },
    mutationFn: async (req: CreateUserRequest): Promise<CreateUserResponse> => {
      return createFakeUserResponse(req); // Mock implementation
      // return apiClient.users.createUser(req); // Real API call (commented)
    },
  });
};
```

### API Layer Consistency Rules (NON-NEGOTIABLE)

- **Domain organization**: `src/api/{domain}/` - endpoints grouped by entity
- **File structure**: Each domain has `types.ts`, `mockData.ts`, and operation files
- **Hook naming**: Always suffix with `Request` (e.g., `useCreateUserRequest`)
- **Query keys**: Use domain-specific base query keys with spread syntax
- **Mutation patterns**: Include proper cache invalidation in `onSuccess`
- **Response types**: Use established `ApiResponse<T>`, `ApiPaginationResponse<T>` wrappers
- **Mock data pattern**: Fake responses with commented real API calls for future activation
- **Network simulation**: 500ms delays in development for realistic UX testing
- **Type safety**: Request/response types from domain-specific `types.ts` files

### Development Workflow

- **src/api/generated/**: Auto-generated from swagger - never edit manually
- **src/api/{domain}/**: Domain-specific endpoints grouped by entity for maintainability
- **TanStack Query**: Global reactive state management for all API interactions
- **useAxiosClient**: Centralized HTTP client with interceptors and config
- **Development pattern**: Currently using fake data with commented real API calls for future activation

## Integration Patterns

### Component Integration Patterns (ESTABLISHED)

#### Container-Use Case Pattern

**Main page components orchestrate use cases without business logic**:

```tsx
// ✅ CORRECT - Container pattern
export default function UsersPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div>
      <ViewAllUsers onAddUser={() => setIsCreateModalOpen(true)} />
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
```

#### Prop-Based Communication

**Use props for component communication, hooks for business logic**:

```tsx
// Parent passes callbacks, children handle their own state
<ViewAllUsers
  onAddUser={handleAddUser} // Callback for actions
  onUserSelect={handleSelect} // Event handling
/>;

// Child components use hooks for their business logic
export default function ViewAllUsers({ onAddUser }) {
  const { state, actions } = useViewAllUsers(); // Own business logic

  return (
    <Button onClick={onAddUser}>Add User</Button>
    // Component handles its own data and state
  );
}
```

#### Extension Point Integration

**Components provide extension points for customization**:

```tsx
// Usage with extension points
<UserDataTable
  users={users}
  customColumns={[
    {
      key: "customField",
      title: "Custom Data",
      render: (user) => <CustomComponent user={user} />,
    },
  ]}
  customActions={[
    {
      label: "Export User",
      icon: Download,
      onClick: (user) => handleExport(user),
    },
  ]}
/>
```

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

### Established Development Patterns (APPLY CONSISTENTLY)

#### Validation & Error Handling

**Consistent validation patterns across use cases**:

```tsx
// Form validation in hooks
export const useCreateUser = () => {
  const [errors, setErrors] = useState<CreateUserFormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: CreateUserFormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { errors, validateForm };
};
```

#### Loading State Management

**Consistent loading patterns with proper UX**:

```tsx
// High cohesion loading states
export default function ListViewStats() {
  const { data: stats, isPending, error } = useGetUsersStatsRequest();

  if (isPending) {
    return <LoadingSkeleton />; // Skeleton UI while loading
  }

  if (error) {
    return <ErrorState message="Unable to load statistics" />;
  }

  return <StatsDisplay data={stats?.data} />;
}
```

#### Search & Pagination Patterns

**Standardized search and pagination across use cases**:

```tsx
// Search state management in hooks
const useViewAllUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const searchParams = useMemo(
    () => ({
      pageNo: currentPage,
      pageSize: pageSize,
      search: searchQuery || undefined,
    }),
    [currentPage, pageSize, searchQuery]
  );

  const actions = {
    handleSearch: (query: string) => {
      setSearchQuery(query);
      setCurrentPage(1); // Reset pagination on search
    },
  };
};
```

#### Selection State Management

**Consistent multi-select patterns**:

```tsx
// Selection management in use-case hooks
const useViewAllUsers = () => {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const actions = {
    selectUser: (userId: string) => {
      setSelectedUserIds((prev) => [...prev, userId]);
    },
    toggleUserSelection: (userId: string) => {
      setSelectedUserIds((prev) =>
        prev.includes(userId)
          ? prev.filter((id) => id !== userId)
          : [...prev, userId]
      );
    },
    selectAllUsers: () => {
      setSelectedUserIds(users.map((user) => user.id!));
    },
    clearSelection: () => {
      setSelectedUserIds([]);
    },
  };
};
```

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

## Established Development Workflow (FOLLOW CONSISTENTLY)

### Feature Development Process

**When adding new feature modules, follow this established pattern**:

1. **Create Epic/Use-Case Structure**:

   ```bash
   src/app/{portal}/{feature}/
   ├── {Feature}Page.tsx
   ├── view-all/
   ├── create/
   ├── profile/ (if needed)
   └── shared/components/
   ```

2. **Implement High Cohesion Components**:

   - Components handle their own data fetching
   - Use-case specific hooks encapsulate business logic
   - Separate types for use-case concerns

3. **Create Reusable Shared Components**:

   - Avatar, badge, actions components for the domain
   - Extensible data table with custom columns/actions
   - Follow Single Responsibility Principle

4. **Apply Extension Points**:
   - `customActions` props for dropdown menus
   - `customColumns` props for data tables
   - Callback props for parent-child communication

### Code Quality Standards (NON-NEGOTIABLE)

#### Component Standards

- **High Cohesion**: Components responsible for their own data needs
- **Single Responsibility**: One clear purpose per component
- **Extension Points**: Open/Closed principle with props-based customization
- **Hook Separation**: Business logic isolated in use-case specific hooks

#### Type Safety Standards

- **Domain Types**: Global types in `src/shared/types/domains/`
- **Use-Case Types**: Local types in use-case directories
- **API Types**: Domain-specific request/response types
- **Error Types**: Dedicated error interfaces for forms/validation

#### API Integration Standards

- **TanStack Query**: All API calls use React Query patterns
- **Domain Organization**: `src/api/{domain}/` structure
- **Mock Development**: Fake data with commented real API calls
- **Cache Management**: Proper invalidation in mutation `onSuccess`

### Testing Readiness Patterns

**Architecture designed for easy testing**:

```tsx
// ✅ Testable - Hook can be tested independently
const { result } = renderHook(() => useViewAllUsers());
expect(result.current.state.hasUsers).toBe(false);

// ✅ Testable - Component has clear props interface
render(<UserAvatar user={mockUser} size="sm" />);

// ✅ Testable - Business logic separated from UI
const { result } = renderHook(() => useCreateUser());
act(() => {
  result.current.updateField("email", "invalid-email");
  result.current.validateForm();
});
expect(result.current.errors.email).toBe("Please enter a valid email address");
```

### Migration & Scalability Patterns

**Established patterns can be applied to all domains**:

- **Patients Module**: Apply same epic/use-case structure
- **Clinics Module**: Reuse component patterns (Avatar, StatusBadge, DataTable)
- **Sedationists Module**: Same hook patterns for business logic
- **Appointments Module**: Same validation and state management patterns

**Cross-Domain Consistency**:

- Same component naming conventions
- Same hook return patterns (`{ state, actions }`)
- Same extension point patterns
- Same API integration patterns

This ensures consistent developer experience and maintainable architecture across the entire application.
