# Error Boundary System - Complete Guide

## Overview

The refactored error boundary system provides a comprehensive, modular approach to error handling in React applications with multiple specialized components and recovery mechanisms.

## Architecture

### Core Components

```
src/shared/components/Error/
├── ErrorBoundary.tsx          # Main error boundary class
├── ErrorDisplay.tsx           # Modular error display component
├── ErrorIcon.tsx              # Reusable error icon
├── ErrorMessage.tsx           # Configurable error messages
├── ErrorActions.tsx           # Error recovery action buttons
├── ErrorDetails.tsx           # Development error details
├── ErrorContext.tsx           # Error reporting context
├── SpecializedErrorBoundaries.tsx  # Specialized boundary types
├── types.ts                   # TypeScript definitions
└── index.ts                   # Barrel exports
```

## Key Features

### ✅ Modular Design

- Broken down into focused, reusable components
- Each component has a single responsibility
- Easy to customize and extend

### ✅ Multiple Error Levels

```typescript
<PageErrorBoundary>        // Full-screen error handling
<SectionErrorBoundary>     // Section-level error isolation
<ComponentErrorBoundary>   // Component-level error isolation
<AsyncErrorBoundary>       // Async operation error handling
```

### ✅ Advanced Error Recovery

- Reset on prop changes
- Reset on key changes
- Manual reset functions
- Automatic retry mechanisms

### ✅ Error Context System

```typescript
const { reportError } = useErrorReporter();

// Manually report errors
reportError(new Error("Something went wrong"), {
  context: "user-action",
  feature: "payment",
});
```

### ✅ Enhanced Logging Integration

- Automatic error ID generation
- Timestamp tracking
- Context propagation
- Error categorization

## Usage Examples

### Basic Page-Level Protection

```typescript
import { PageErrorBoundary } from "@/shared/components/Error";

function App() {
  return (
    <PageErrorBoundary>
      <YourApp />
    </PageErrorBoundary>
  );
}
```

### Section-Level Error Isolation

```typescript
import { SectionErrorBoundary } from "@/shared/components/Error";

function Dashboard() {
  return (
    <div>
      <Header /> {/* Not protected - header always visible */}
      <SectionErrorBoundary>
        <UserProfile /> {/* Protected section */}
      </SectionErrorBoundary>
      <SectionErrorBoundary>
        <ActivityFeed /> {/* Another protected section */}
      </SectionErrorBoundary>
    </div>
  );
}
```

### Component-Level Protection

```typescript
import { ComponentErrorBoundary } from "@/shared/components/Error";

function ProductList() {
  return (
    <div>
      {products.map((product) => (
        <ComponentErrorBoundary key={product.id} isolate>
          <ProductCard product={product} />
        </ComponentErrorBoundary>
      ))}
    </div>
  );
}
```

### Custom Error Boundaries

```typescript
import { ErrorBoundary } from "@/shared/components/Error";

const CustomBoundary = ({ children }) => (
  <ErrorBoundary
    level="component"
    resetOnPropsChange={true}
    onError={(error, errorInfo) => {
      // Custom error handling
      analytics.track("component_error", { error: error.message });
    }}
    fallback={<CustomErrorDisplay />}
  >
    {children}
  </ErrorBoundary>
);
```

### Error Recovery with Reset Keys

```typescript
function UserProfile() {
  const [userId, setUserId] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  return (
    <ErrorBoundary
      resetKeys={[userId, resetKey]}
      onError={() => {
        // Reset the component when user changes
        setResetKey((prev) => prev + 1);
      }}
    >
      <UserProfileContent userId={userId} />
    </ErrorBoundary>
  );
}
```

### Manual Error Reporting

```typescript
import { useErrorReporter } from "@/shared/components/Error";

function PaymentForm() {
  const { reportError } = useErrorReporter();

  const handlePayment = async () => {
    try {
      await processPayment();
    } catch (error) {
      reportError(error, {
        feature: "payment",
        amount: formData.amount,
        paymentMethod: formData.method,
      });
    }
  };
}
```

## Configuration Options

### ErrorBoundary Props

```typescript
interface ErrorBoundaryConfig {
  fallback?: React.ReactNode; // Custom error display
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean; // Reset when props change
  resetKeys?: Array<string | number>; // Reset when keys change
  isolate?: boolean; // Isolate from parent boundaries
  level?: "page" | "section" | "component"; // Error boundary level
}
```

### Error Display Customization

```typescript
<ErrorDisplay
  title="Custom Error Title"
  message="Custom error message"
  severity="warning" // 'error' | 'warning' | 'info'
  showRetry={true}
  showReload={false}
  onRetry={handleRetry}
  onReload={handleReload}
  className="custom-styling"
/>
```

## Error Context System

### Provider Setup

```typescript
import { ErrorProvider } from "@/shared/components/Error";

function App() {
  return (
    <ErrorProvider>
      <YourApp />
    </ErrorProvider>
  );
}
```

### Using Error Context

```typescript
import { useErrorContext, useErrorReporter } from "@/shared/components/Error";

function MyComponent() {
  const { errorCount, clearError } = useErrorContext();
  const { reportError } = useErrorReporter();

  // Report errors manually
  const handleAsyncError = async () => {
    try {
      await riskyOperation();
    } catch (error) {
      reportError(error, { operation: "risky-operation" });
    }
  };
}
```

## Development vs Production

### Development Mode

- Detailed error information displayed
- Full stack traces visible
- Component stack traces shown
- Error boundaries highlighted
- Console logging enhanced

### Production Mode

- User-friendly error messages
- Technical details hidden
- Errors logged to external services
- Graceful degradation
- Recovery options prominent

## Testing Error Boundaries

Visit `/error-boundary-demo` to test:

- Different error types (render, async, null reference)
- Section vs component error isolation
- Error recovery mechanisms
- Manual error reporting
- Nested error boundary behavior

## Best Practices

### 1. Use Appropriate Error Boundary Levels

```typescript
// ✅ Good - Page level for critical failures
<PageErrorBoundary>
  <App />
</PageErrorBoundary>

// ✅ Good - Section level for feature isolation
<SectionErrorBoundary>
  <UserDashboard />
</SectionErrorBoundary>

// ✅ Good - Component level for individual items
<ComponentErrorBoundary isolate>
  <UserCard user={user} />
</ComponentErrorBoundary>
```

### 2. Implement Proper Error Recovery

```typescript
// ✅ Good - Reset on data changes
<ErrorBoundary resetKeys={[userId, dataVersion]}>
  <UserData />
</ErrorBoundary>

// ✅ Good - Custom recovery logic
<ErrorBoundary onError={handleError}>
  <CriticalComponent />
</ErrorBoundary>
```

### 3. Provide Meaningful Error Messages

```typescript
// ✅ Good - Context-specific messages
const errorMessages = {
  payment:
    "We couldn't process your payment. Please try again or contact support.",
  profile:
    "Your profile information couldn't be loaded. Please refresh the page.",
  search: "Search is temporarily unavailable. Please try again later.",
};
```

### 4. Use Error Context for Complex Scenarios

```typescript
// ✅ Good - Centralized error handling
const { reportError } = useErrorReporter();

useEffect(() => {
  api.onError((error) => {
    reportError(error, { source: "api", endpoint: error.config?.url });
  });
}, [reportError]);
```

## Integration with Logging System

The error boundary system is fully integrated with the centralized logging system:

- All errors automatically logged with context
- Error IDs generated for tracking
- Timestamps recorded for debugging
- Integration with external services
- Development vs production logging

## Performance Considerations

- Error boundaries don't affect performance in normal operation
- Component isolation prevents cascading failures
- Reset mechanisms prevent memory leaks
- Logging is optimized for production
- Fallback components are lightweight

This refactored error boundary system provides enterprise-level error handling with excellent user experience and developer productivity.
