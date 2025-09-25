import { UseFormReturn } from "react-hook-form";
import {
  BasicInformationStep,
  RolePermissionsStep,
  AccountSettingsStep,
  ReviewConfirmStep,
} from "./steps";
import { CreateUserFormData } from "./FormConfig";

interface StepContentProps {
  currentStep: number;
  form: UseFormReturn<CreateUserFormData>;
}

/**
 * Step content router - renders appropriate step component
 * Delegates to specialized step components for better organization
 */
export function StepContent({ currentStep, form }: StepContentProps) {
  switch (currentStep) {
    case 1:
      return <BasicInformationStep form={form} />;
    case 2:
      return <RolePermissionsStep form={form} />;
    case 3:
      return <AccountSettingsStep form={form} />;
    case 4:
      return <ReviewConfirmStep form={form} />;
    default:
      return null;
  }
}
