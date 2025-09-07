import { 
  AppointmentDocument, 
  AppointmentActivity, 
  AppointmentPayment, 
  AppointmentManagement 
} from "@/shared/types/entities/appointment";
import { PatientTitle } from "@/shared/types/enums/patient";
import { DocumentType, DocumentStatus, ActivityType } from "@/shared/types/enums/appointment";
import { PaymentMethod, PaymentStatus } from "@/shared/types/enums/payment";

// Re-export shared types for backward compatibility
export { 
  AppointmentDocument,
  AppointmentActivity,
  AppointmentPayment,
  AppointmentManagement,
  PatientTitle,
  DocumentType,
  DocumentStatus,
  ActivityType,
  PaymentMethod,
  PaymentStatus
};