import { UseFormReturn } from "react-hook-form";
import { FormTextField } from "@/shared/components/form";
import { CreateUserFormData } from "../FormConfig";

interface BasicInformationStepProps {
  form: UseFormReturn<CreateUserFormData>;
}

/**
 * Step 1: Basic Information - Name, email, phone
 * Focused component for user's basic details
 */
export function BasicInformationStep({ form }: BasicInformationStepProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormTextField
          control={form.control}
          name="firstName"
          label="First Name"
          placeholder="Enter first name"
          required
        />
        <FormTextField
          control={form.control}
          name="lastName"
          label="Last Name"
          placeholder="Enter last name"
          required
        />
      </div>
      <FormTextField
        control={form.control}
        name="email"
        label="Email Address"
        type="email"
        placeholder="Enter email address"
        required
      />
      <FormTextField
        control={form.control}
        name="phone"
        label="Phone Number"
        type="tel"
        placeholder="Enter phone number (optional)"
      />
    </div>
  );
}
