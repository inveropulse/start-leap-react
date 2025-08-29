# Notification System

A consolidated notification system for the Sedation Solutions Portal, providing consistent toast notifications across the application.

## Features

- 🎨 **Consistent Styling**: Unified color scheme and positioning for all notification types
- ⚡ **Multiple Types**: Success, Error, Warning, and Info notifications with distinct styling
- ⏱️ **Configurable Timeouts**: Different auto-dismiss durations for each notification type
- 🔄 **Progress Updates**: Update existing notifications dynamically
- 📌 **Persistent Notifications**: Notifications that don't auto-dismiss for critical messages
- 🗂️ **Bulk Management**: Dismiss all notifications at once
- 📊 **Integrated Logging**: All notifications are automatically logged via LoggingProvider
- 🔢 **Smart Limiting**: Maximum of 3 notifications displayed simultaneously

## Quick Start

### Import and Use

```tsx
import { useNotifications } from "@/shared/notifications";

function MyComponent() {
  const notifications = useNotifications();

  const handleSuccess = () => {
    notifications.showSuccess(
      "Data saved!",
      "Your changes have been applied successfully."
    );
  };

  const handleError = () => {
    notifications.showError("Save failed", "Please try again later.");
  };

  return (
    <div>
      <button onClick={handleSuccess}>Save</button>
      <button onClick={handleError}>Simulate Error</button>
    </div>
  );
}
```

## API Reference

### Basic Notification Methods

```tsx
const notifications = useNotifications();

// Success notification (5s auto-dismiss)
notifications.showSuccess(message: string, description?: string, duration?: number)

// Error notification (8s auto-dismiss)
notifications.showError(message: string, description?: string, duration?: number)

// Warning notification (5s auto-dismiss)
notifications.showWarning(message: string, description?: string, duration?: number)

// Info notification (3s auto-dismiss)
notifications.showInfo(message: string, description?: string, duration?: number)

// Persistent notification (no auto-dismiss)
notifications.showPersistent(message: string, description?: string, variant?: "SUCCESS" | "ERROR" | "WARNING" | "INFO")
```

### Advanced Features

```tsx
// Update an existing notification
const toastId = notifications.showInfo("Processing...");
notifications.updateToast(toastId, {
  title: "Almost done...",
  description: "90% complete",
});

// Dismiss specific notification
notifications.dismiss(toastId);

// Dismiss all notifications
notifications.dismissAll();

// Access current toasts
const { toasts } = notifications;
```

### Configuration Constants

```tsx
import { TOAST_CONFIG } from "@/shared/notifications";

// Duration options
TOAST_CONFIG.DURATIONS.SHORT; // 3000ms
TOAST_CONFIG.DURATIONS.MEDIUM; // 5000ms
TOAST_CONFIG.DURATIONS.LONG; // 8000ms
TOAST_CONFIG.DURATIONS.PERSISTENT; // null (no auto-dismiss)

// Use custom duration
notifications.showSuccess(
  "Quick message",
  undefined,
  TOAST_CONFIG.DURATIONS.SHORT
);
```

## Examples

### API Integration

```tsx
const handleApiCall = async () => {
  const loadingToast = notifications.showInfo("Saving...", "Please wait");

  try {
    await saveData();
    notifications.dismiss(loadingToast);
    notifications.showSuccess("Saved successfully!");
  } catch (error) {
    notifications.dismiss(loadingToast);
    notifications.showError("Save failed", error.message);
  }
};
```

### Progress Updates

```tsx
const handleLongOperation = () => {
  const progressToast = notifications.showInfo("Starting process...");

  setTimeout(() => {
    notifications.updateToast(progressToast, {
      title: "50% Complete",
      description: "Processing files...",
    });
  }, 2000);

  setTimeout(() => {
    notifications.updateToast(progressToast, {
      title: "Completed!",
      description: "All files processed",
      variant: "success",
    });
  }, 4000);
};
```

### Form Validation

```tsx
const handleFormSubmit = (formData) => {
  const errors = validateForm(formData);

  if (errors.length > 0) {
    errors.forEach((error) => {
      notifications.showWarning("Validation Error", error.message);
    });
    return;
  }

  notifications.showSuccess("Form submitted successfully!");
};
```

## Styling Variants

The system includes 4 distinct visual styles:

- **Success**: Green background and border for positive actions
- **Error**: Red background and border for errors and failures
- **Warning**: Yellow background and border for warnings and cautions
- **Info**: Default theme colors for informational messages

## Architecture

### File Structure

```
src/shared/
├── provider/
│   └── NotificationProvider.tsx    # Main provider with all logic
├── ui/
│   ├── toast.tsx                   # Enhanced toast components
│   └── toaster.tsx                 # Updated toaster container
└── notifications/
    └── index.ts                    # Single entry point
```

### Integration

The NotificationProvider is automatically included in `WithProviders.tsx`, making notifications available throughout the entire application without additional setup.

### Provider Hierarchy

```tsx
<ErrorBoundary>
  <LoggingProvider>
    <NotificationProvider>
      {" "}
      {/* 👈 Notifications available here */}
      <TanstackProvider>
        <AxiosClientProvider>{children}</AxiosClientProvider>
      </TanstackProvider>
    </NotificationProvider>
  </LoggingProvider>
</ErrorBoundary>
```

## Best Practices

### When to Use Each Type

- **Success**: Completed operations, saved data, successful submissions
- **Error**: Failed operations, validation errors, network issues
- **Warning**: Non-critical issues, storage limits, deprecated features
- **Info**: Status updates, navigation feedback, general information

### Duration Guidelines

- **Short (3s)**: Simple confirmations, quick status updates
- **Medium (5s)**: Standard operations, form submissions
- **Long (8s)**: Error messages that require reading
- **Persistent**: Critical errors requiring user action

### Accessibility

- All notifications are keyboard accessible
- Screen reader compatible with proper ARIA labels
- High contrast colors for visibility
- Non-intrusive positioning

## Migration from use-toast

The old `use-toast.ts` hook has been fully integrated into `NotificationProvider`. Replace any direct imports:

```tsx
// Before
import { toast, useToast } from "@/shared/hooks/use-toast";

// After
import { useNotifications } from "@/shared/notifications";
```

## Demo

Visit the Internal Portal (`/internal`) to see a comprehensive demo of all notification features and capabilities.
