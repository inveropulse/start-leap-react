import { UseFormReturn } from "react-hook-form";
import { FormSelect } from "@/shared/components/form";
import {
  roleOptions,
  departmentOptions,
  permissionLevelOptions,
  CreateUserFormData,
} from "../FormConfig";

interface RolePermissionsStepProps {
  form: UseFormReturn<CreateUserFormData>;
}

/**
 * Step 2: Role & Permissions - System access configuration
 * Handles role, department, and permission level selection
 */
export function RolePermissionsStep({ form }: RolePermissionsStepProps) {
  return (
    <div className="space-y-4">
      <FormSelect
        control={form.control}
        name="role"
        label="Role"
        placeholder="Select role"
        options={roleOptions}
        required
      />
      <FormSelect
        control={form.control}
        name="department"
        label="Department"
        placeholder="Select department"
        options={departmentOptions}
        required
      />
      <FormSelect
        control={form.control}
        name="permissionLevel"
        label="Permission Level"
        placeholder="Select permission level"
        options={permissionLevelOptions}
        required
      />
    </div>
  );
}
