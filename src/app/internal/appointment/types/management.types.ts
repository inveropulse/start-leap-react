import { 
  AppointmentDocument, 
  AppointmentActivity, 
  AppointmentPayment
} from "@/shared/types/domains/appointment/value-objects";
import { Appointment } from "@/shared/types/domains/appointment/entities";
import { PatientTitle } from "@/shared/types/domains/patient/enums";
import { DocumentType, DocumentStatus, ActivityType } from "@/shared/types/domains/appointment/enums";
import { PaymentMethod, PaymentStatus } from "@/shared/types/domains/payment/enums";

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
  PaymentStatus
};
export type { 
  AppointmentDocument,
  AppointmentActivity,
  AppointmentPayment
};