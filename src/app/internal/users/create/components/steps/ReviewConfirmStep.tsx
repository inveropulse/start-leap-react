import { UseFormReturn } from "react-hook-form";
import {
  roleOptions,
  departmentOptions,
  permissionLevelOptions,
  CreateUserFormData,
} from "../FormConfig";

interface ReviewConfirmStepProps {
  form: UseFormReturn<CreateUserFormData>;
}

/**
 * Step 4: Review & Confirm - Final review before submission
 * Shows all entered information for user confirmation
 */
export function ReviewConfirmStep({ form }: ReviewConfirmStepProps) {
  const watchedValues = form.watch();

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="font-medium mb-3">User Information</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Name:</span>
            <p className="font-medium">
              {watchedValues.firstName} {watchedValues.lastName}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Email:</span>
            <p className="font-medium">{watchedValues.email}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Phone:</span>
            <p className="font-medium">
              {watchedValues.phone || "Not provided"}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Role:</span>
            <p className="font-medium">
              {
                roleOptions.find((opt) => opt.value === watchedValues.role)
                  ?.label
              }
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Department:</span>
            <p className="font-medium">
              {
                departmentOptions.find(
                  (opt) => opt.value === watchedValues.department
                )?.label
              }
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Permission Level:</span>
            <p className="font-medium">
              {
                permissionLevelOptions.find(
                  (opt) => opt.value === watchedValues.permissionLevel
                )?.label
              }
            </p>
          </div>
        </div>
        {watchedValues.notes && (
          <div className="mt-3 pt-3 border-t">
            <span className="text-muted-foreground">Notes:</span>
            <p className="font-medium">{watchedValues.notes}</p>
          </div>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          {watchedValues.sendWelcomeEmail
            ? "✓ A welcome email will be sent to the user with login instructions"
            : "✗ No welcome email will be sent"}
        </p>
      </div>
    </div>
  );
}
