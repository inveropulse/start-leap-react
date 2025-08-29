import { useNotifications, TOAST_CONFIG } from "@/shared/notifications";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

const NotificationDemo = () => {
  const notifications = useNotifications();

  const handleQuickSuccess = () => {
    notifications.showSuccess(
      "Quick update!",
      "This will disappear quickly",
      TOAST_CONFIG.DURATIONS.SHORT
    );
  };

  const handlePersistentError = () => {
    const toastId = notifications.showPersistent(
      "Critical Error",
      "This requires your attention and won't auto-dismiss",
      "ERROR"
    );

    // You can dismiss it later programmatically
    setTimeout(() => {
      notifications.dismiss(toastId);
    }, 10000);
  };

  const handleProgressUpdate = () => {
    const toastId = notifications.showInfo("Processing...", "Please wait");

    // Simulate progress updates
    setTimeout(() => {
      notifications.updateToast(toastId, {
        title: "Almost done...",
        description: "90% complete",
      });
    }, 2000);

    setTimeout(() => {
      notifications.updateToast(toastId, {
        title: "Completed!",
        description: "Process finished successfully",
        variant: "success",
      });
    }, 4000);
  };

  const handleBulkOperations = () => {
    // Show multiple notifications
    notifications.showInfo("Starting bulk operation...");
    notifications.showWarning(
      "This may take a while",
      "Please don't close the browser"
    );
    notifications.showInfo("Processing files...", "3 of 10 complete");

    setTimeout(() => {
      notifications.dismissAll(); // Clear all at once
      notifications.showSuccess(
        "Bulk operation completed!",
        "All files processed successfully"
      );
    }, 3000);
  };

  const handleApiSimulation = async () => {
    const loadingToastId = notifications.showInfo(
      "Saving data...",
      "Please wait while we process your request"
    );

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate random success/error
      if (Math.random() > 0.5) {
        notifications.dismiss(loadingToastId);
        notifications.showSuccess(
          "Data saved successfully!",
          "Your changes have been applied"
        );
      } else {
        throw new Error("Network timeout");
      }
    } catch (error: any) {
      notifications.dismiss(loadingToastId);
      notifications.showError(
        "Failed to save data",
        error.message || "Please try again later"
      );
    }
  };

  const handleWarningExample = () => {
    notifications.showWarning(
      "Storage almost full",
      "You have less than 10% storage remaining",
      TOAST_CONFIG.DURATIONS.LONG
    );
  };

  const handleMultipleTypes = () => {
    notifications.showInfo("Operation started");
    setTimeout(
      () => notifications.showWarning("Intermediate step completed"),
      500
    );
    setTimeout(() => notifications.showError("Minor issue detected"), 1000);
    setTimeout(() => notifications.showSuccess("All issues resolved!"), 1500);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Notification System Demo</CardTitle>
        <CardDescription>
          Try out the different notification types and features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Basic Types</h3>
            <div className="space-y-2">
              <Button
                onClick={() =>
                  notifications.showSuccess("Success!", "Operation completed")
                }
                className="w-full"
                size="sm"
              >
                Success
              </Button>
              <Button
                onClick={() =>
                  notifications.showError("Error!", "Something went wrong")
                }
                className="w-full"
                size="sm"
                variant="destructive"
              >
                Error
              </Button>
              <Button
                onClick={() =>
                  notifications.showWarning("Warning!", "Please be careful")
                }
                className="w-full"
                size="sm"
                variant="outline"
              >
                Warning
              </Button>
              <Button
                onClick={() =>
                  notifications.showInfo("Info", "Here's some information")
                }
                className="w-full"
                size="sm"
                variant="secondary"
              >
                Info
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-sm">Advanced Features</h3>
            <div className="space-y-2">
              <Button onClick={handleQuickSuccess} className="w-full" size="sm">
                Quick Dismiss
              </Button>
              <Button
                onClick={handlePersistentError}
                className="w-full"
                size="sm"
              >
                Persistent
              </Button>
              <Button
                onClick={handleProgressUpdate}
                className="w-full"
                size="sm"
              >
                Progress Update
              </Button>
              <Button
                onClick={handleApiSimulation}
                className="w-full"
                size="sm"
              >
                API Simulation
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t pt-4 space-y-2">
          <h3 className="font-medium text-sm">Bulk Operations</h3>
          <div className="flex space-x-2">
            <Button onClick={handleBulkOperations} size="sm">
              Bulk Operations
            </Button>
            <Button onClick={handleMultipleTypes} size="sm" variant="outline">
              Multiple Types
            </Button>
            <Button onClick={handleWarningExample} size="sm" variant="outline">
              Long Warning
            </Button>
            <Button
              onClick={() => notifications.dismissAll()}
              size="sm"
              variant="destructive"
            >
              Clear All
            </Button>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="text-sm text-gray-600">
            <p>
              <strong>Features demonstrated:</strong>
            </p>
            <ul className="list-disc list-inside text-xs mt-1 space-y-1">
              <li>4 notification types with consistent styling</li>
              <li>Configurable auto-dismiss timeouts</li>
              <li>Persistent notifications that don't auto-dismiss</li>
              <li>Progress updates via updateToast</li>
              <li>Bulk dismiss operations</li>
              <li>Integrated logging for all notifications</li>
              <li>Multiple toast limit (max 3 shown)</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationDemo;
