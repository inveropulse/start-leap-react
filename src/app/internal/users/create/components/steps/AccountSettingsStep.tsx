import { UseFormReturn } from "react-hook-form";
import { FormTextField } from "@/shared/components/form";
import { CreateUserFormData } from "../FormConfig";

interface AccountSettingsStepProps {
  form: UseFormReturn<CreateUserFormData>;
}

/**
 * Step 3: Account Settings - Notes and welcome email preference
 * Additional configuration for user account setup
 */
export function AccountSettingsStep({ form }: AccountSettingsStepProps) {
  return (
    <div className="space-y-4">
      <FormTextField
        control={form.control}
        name="notes"
        label="Notes"
        placeholder="Add any additional notes about this user..."
      />
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="sendWelcomeEmail"
          {...form.register("sendWelcomeEmail")}
          className="rounded border-gray-300"
        />
        <label htmlFor="sendWelcomeEmail" className="text-sm">
          Send welcome email with login instructions
        </label>
      </div>
    </div>
  );
}
