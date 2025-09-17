import { AppointmentType } from "@/shared/types/domains/appointment/enums";
import { Patient } from "@/shared/types/domains/patient/entities";
import { Clinic, ClinicDoctor } from "@/shared/types/domains/clinic/entities";
import { Sedationist } from "@/shared/types/domains/sedationist/entities";
import { AppointmentDetails } from "@/shared/types/domains/appointment/entities";

// Re-export shared types for backward compatibility
export { AppointmentType };

// Wizard specific interfaces - using aliases for compatibility
export interface WizardPatient extends Patient {}
export interface WizardClinic extends Clinic {}
export interface WizardDoctor extends ClinicDoctor {}
export interface WizardSedationist extends Sedationist {}

export interface WizardData {
  patient?: WizardPatient;
  clinic?: WizardClinic;
  doctor?: WizardDoctor;
  sedationist?: WizardSedationist;
  appointmentDetails?: AppointmentDetails;
}

export enum WizardStep {
  PATIENT_SELECTION = 1,
  CLINIC_SELECTION = 2,
  DOCTOR_SELECTION = 3,
  SEDATIONIST_SELECTION = 4,
  APPOINTMENT_DETAILS = 5,
  REVIEW_CONFIRM = 6,
}

export interface StepValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface WizardStepProps {
  data: WizardData;
  onDataChange: (data: Partial<WizardData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  validate?: () => StepValidationResult;
}
