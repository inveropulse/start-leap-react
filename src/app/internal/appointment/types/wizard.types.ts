import { 
  AppointmentType, 
  WizardData, 
  WizardStep, 
  StepValidationResult, 
  WizardStepProps,
  WizardPatient,
  WizardClinic,
  WizardDoctor,
  WizardSedationist
} from "@/shared/types/entities/appointment";

// Re-export shared types for backward compatibility
export { 
  AppointmentType,
  WizardStep
};
export type { 
  WizardData,
  StepValidationResult,
  WizardStepProps,
  WizardPatient,
  WizardClinic,
  WizardDoctor,
  WizardSedationist
};