// Enhanced types for appointment management system
export interface AppointmentDocument {
  id: string;
  appointmentId: string;
  type: DocumentType;
  name: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: string;
  status: DocumentStatus;
  url?: string;
  notes?: string;
}

export enum DocumentType {
  PATIENT_PACK = 'patient_pack',
  CLINIC_DOCUMENT = 'clinic_document', 
  SEDATION_RECORD = 'sedation_record',
  CONSENT_FORM = 'consent_form',
  MEDICAL_HISTORY = 'medical_history',
  OTHER = 'other'
}

export enum DocumentStatus {
  PENDING = 'pending',
  UPLOADED = 'uploaded',
  SIGNED = 'signed',
  COMPLETED = 'completed',
  REJECTED = 'rejected'
}

export interface AppointmentActivity {
  id: string;
  appointmentId: string;
  type: ActivityType;
  status: string;
  title: string;
  description: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export enum ActivityType {
  STATUS_CHANGE = 'status_change',
  PATIENT_NOTIFICATION = 'patient_notification',
  CLINIC_NOTIFICATION = 'clinic_notification', 
  DOCUMENT_UPLOADED = 'document_uploaded',
  DOCUMENT_SIGNED = 'document_signed',
  PAYMENT_RECEIVED = 'payment_received',
  APPOINTMENT_CREATED = 'appointment_created',
  APPOINTMENT_UPDATED = 'appointment_updated',
  SEDATION_COMPLETED = 'sedation_completed',
  NOTES_ADDED = 'notes_added'
}

export interface AppointmentPayment {
  id: string;
  appointmentId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  reference?: string;
  notes?: string;
  paidBy?: string;
  paidAt?: string;
  confirmedBy?: string;
  confirmedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  BANK_TRANSFER = 'bank_transfer',
  INSURANCE = 'insurance',
  OTHER = 'other'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PARTIAL = 'partial',
  REFUNDED = 'refunded',
  FAILED = 'failed'
}

export interface AppointmentManagement {
  appointment: any; // Will use existing Appointment type
  documents: AppointmentDocument[];
  activities: AppointmentActivity[];
  payments: AppointmentPayment[];
}

// Patient title enum from production screenshot
export enum PatientTitle {
  MR = 'Mr',
  MRS = 'Mrs', 
  MS = 'Ms',
  DR = 'Dr',
  PROF = 'Prof'
}