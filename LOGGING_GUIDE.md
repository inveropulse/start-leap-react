# Centralized Logging System - Usage Guide

## Overview

The centralized logging system for Sedation Solutions provides enterprise-level logging capabilities with external service integration, error tracking, and contextual logging throughout the application.

## Features

- ✅ Centralized logging with context management
- ✅ Multiple log levels (debug, info, warn, error, fatal)
- ✅ External service integration (mock DataDog & Sentry)
- ✅ Automatic API request/response logging
- ✅ React Error Boundary integration
- ✅ Global error and promise rejection handling
- ✅ Buffered logging for production
- ✅ Development vs Production modes
- ✅ No-fail guarantee - logging errors won't break your app

## Basic Usage

### Import and Use Logger

```typescript
import { logger } from "@/lib/logger";

// Basic logging
logger.info("User logged in", { userId: "123" });
logger.error("API call failed", new Error("Network timeout"));
logger.warn("Deprecated function used", { function: "oldMethod" });
```

### React Hook Usage

```typescript
import { useLogger } from "@/hooks/useLogger";

const MyComponent = () => {
  const logger = useLogger({
    feature: "user-profile",
    userId: user?.id,
  });

  const handleSave = async () => {
    try {
      logger.info("Saving user profile", { action: "save" });
      await saveProfile();
      logger.info("Profile saved successfully");
    } catch (error) {
      logger.error("Failed to save profile", error);
    }
  };
};
```

### API Logging Hook

```typescript
import { useApiLogger } from "@/hooks/useLogger";

const useUserApi = () => {
  const apiLogger = useApiLogger("/api/users");

  const fetchUsers = async () => {
    apiLogger.logApiCall("GET");
    try {
      const users = await api.getUsers();
      apiLogger.logApiSuccess("GET", { count: users.length });
      return users;
    } catch (error) {
      apiLogger.logApiError("GET", error);
      throw error;
    }
  };
};
```

## Context Management

### Set Global Context

```typescript
import { logger } from "@/lib/logger";

// Set user context when user logs in
logger.setContext({
  userId: user.id,
  feature: "dashboard",
  metadata: { role: user.role },
});
```

### Child Loggers

```typescript
// Create focused loggers for specific features
const authLogger = logger.child({
  feature: "authentication",
  action: "login",
});

authLogger.info("Login attempt"); // Includes auth context
```

## Available Log Levels

```typescript
logger.debug("Debug information", data); // Development only
logger.info("General information", data); // All environments
logger.warn("Warning message", data); // All environments
logger.error("Error occurred", error, data); // All environments + immediate send
logger.fatal("Critical error", error, data); // All environments + immediate send
```

## Automatic Features

### API Request Logging

All API calls through the Axios client are automatically logged with:

- Request method and URL
- Response status and time
- Error details if failed

### Error Boundary Integration

React errors are automatically caught and logged with:

- Component stack traces
- Error details
- User-friendly error display

### Global Error Handling

Uncaught errors and promise rejections are automatically logged.

## Production Features

### External Service Integration

In production, logs are sent to mock external services (DataDog, Sentry).
Replace with real services:

```typescript
// src/lib/logging/setup.ts
import { RealDataDogService } from "./realDataDogService";
logger.addExternalService(new RealDataDogService(API_KEY));
```

### Log Buffering

- Logs are batched every 30 seconds in production
- Critical errors (error/fatal) are sent immediately
- Buffer automatically flushes on page unload

## Testing the System

Visit `/logging-demo` in your application to:

- Test all log levels
- View statistics from mock services
- See recent logs
- Test error scenarios

## Best Practices

### 1. Use Contextual Logging

```typescript
// Good
const logger = useLogger({ feature: "checkout", userId: user.id });
logger.info("Payment processed", { orderId, amount });

// Better than
logger.info("Payment processed for user 123 in checkout");
```

### 2. Include Relevant Data

```typescript
// Good
logger.error("Payment failed", error, {
  orderId: order.id,
  paymentMethod: payment.method,
  amount: payment.amount,
});
```

### 3. Use Appropriate Log Levels

- `debug`: Development debugging info
- `info`: Normal application flow
- `warn`: Unexpected but recoverable situations
- `error`: Error conditions that need attention
- `fatal`: Critical errors that might crash the system

### 4. Child Loggers for Features

```typescript
// Create feature-specific loggers
const paymentLogger = logger.child({ feature: "payment" });
const authLogger = logger.child({ feature: "authentication" });
```

## Environment Configuration

### Development

- Logs displayed in browser console with styling
- Full stack traces shown
- Immediate logging (no buffering)

### Production

- Logs sent to external services
- Buffered for performance
- Error details sent immediately
- Sensitive info should be filtered

## Error Recovery

The logging system is designed to never break your application:

- All logging operations are wrapped in try-catch
- External service failures are handled gracefully
- Fallback mechanisms for all critical operations
- Silent failures to prevent logging errors from affecting UX

## Monitoring & Analytics

Use the mock services to monitor:

- Application usage patterns
- Error rates and types
- Performance metrics
- User behavior flows

## Integration Examples

### Form Submission

```typescript
const handleSubmit = async (formData) => {
  const logger = useLogger({ feature: "contact-form" });

  logger.info("Form submission started", {
    fields: Object.keys(formData),
    timestamp: Date.now(),
  });

  try {
    await submitForm(formData);
    logger.info("Form submitted successfully");
  } catch (error) {
    logger.error("Form submission failed", error, { formData });
  }
};
```

### Navigation Tracking

```typescript
useEffect(() => {
  logger.info("Page viewed", {
    page: location.pathname,
    referrer: document.referrer,
  });
}, [location.pathname]);
```

This logging system provides comprehensive coverage for the Sedation Solutions application and can be easily extended with additional external services as needed.
