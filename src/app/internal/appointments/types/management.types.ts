import {
  Appointment,
  AppointmentActivity,
  AppointmentDocument,
  AppointmentPayment,
} from "@/shared/types/domains/appointment/entities";
import { PatientTitle } from "@/shared/types/domains/patient/enums";
import {
  DocumentType,
  DocumentStatus,
  ActivityType,
  PaymentMethod,
  PaymentStatus,
} from "@/shared/types/domains/appointment/enums";

// Feature-specific management aggregate
export interface AppointmentManagement {
  appointment: Appointment;
  documents: AppointmentDocument[];
  activities: AppointmentActivity[];
  payments: AppointmentPayment[];
}

// Re-export shared types for backward compatibility
export {
  PatientTitle,
  DocumentType,
  DocumentStatus,
  ActivityType,
  PaymentMethod,
  PaymentStatus,
};
export type { AppointmentDocument, AppointmentActivity, AppointmentPayment };
