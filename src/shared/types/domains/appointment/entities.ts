import {
  AppointmentStatus,
  AppointmentType,
  AppointmentPriority,
  PaymentMethod,
  PaymentStatus,
  DocumentType,
  DocumentStatus,
  ActivityType,
  FileType,
} from "./enums";

// Base appointment fields - core business data only
export type BaseAppointmentFields = {
  // Core appointment info
  reference: string;
  appointmentDateTime: string; // ISO 8601 string
  duration: number; // Duration in minutes
  status: AppointmentStatus;
  type: AppointmentType;
  priority?: AppointmentPriority;

  // Entity relationships
  patientId: string;
  clinicId: string;
  doctorId: string;
  sedationistId?: string; // Optional as assignment can be done later

  // Appointment details
  procedure?: string;
  specialInstructions?: string;
  estimatedCost?: number;

  // Internal notes
  internalNotes?: string;
  followUpRequired?: boolean;
  followUpInstructions?: string;
};

// Extended appointment entity with computed/system fields
export type Appointment = Partial<BaseAppointmentFields> & {
  id?: string;

  // Computed display fields to avoid extra API calls
  patientName?: string;
  clinicName?: string;
  doctorName?: string;
  sedationistName?: string;

  // System timestamps
  createdDateTime?: string; // ISO 8601 string
  updatedDateTime?: string; // ISO 8601 string

  // Computed business fields
  isOverdue?: boolean;
  canReschedule?: boolean;
  canCancel?: boolean;
  daysUntilAppointment?: number;
};

// Payment tracking entity
export type AppointmentPayment = {
  id?: string;
  appointmentId: string;
  amount: number;
  currency?: string; // Default to system currency if not specified
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  paymentDate?: string; // ISO 8601 string
  referenceNumber?: string;
  notes?: string;

  // System fields
  createdDateTime?: string;
  updatedDateTime?: string;
};

// Document tracking entity
export type AppointmentDocument = {
  id?: string;
  appointmentId: string;
  documentType: DocumentType;
  status: DocumentStatus;
  fileName?: string;
  fileType: FileType;
  url?: string;
  uploadedBy?: string; // User ID or name
  uploadedDateTime?: string; // ISO 8601 string
  notes?: string;

  // System fields
  createdDateTime?: string;
  updatedDateTime?: string;
};

// Activity/audit log entity for appointment changes
export type AppointmentActivity = {
  id?: string;
  appointmentId: string;
  activityType: ActivityType;
  description: string;
  performedBy?: string; // User ID or name
  performedDateTime?: string; // ISO 8601 string
  systemGenerated: boolean;
  // Activity-specific data (flexible JSON-like structure)
  activityData?: {
    previousValue?: any;
    newValue?: any;
    notes?: string;
    [key: string]: any;
  };

  // System fields
  createdDateTime?: string;
};

// // Relation entities following Option B pattern (minimal display data)
export type PatientAppointment = {
  doctorId: string;
  clinicId: string;
  patientId: string;
  appointmentId: string;
  sedationistId: string;
  reference: string;
  // Minimal display data to avoid extra API calls
  patientFullName?: string;
  doctorName?: string;
  clinicName?: string;
  sedationistName?: string;
  appointmentDateTime?: string; // ISO 8601 string
  appointmentDuration?: number;
  procedure?: string;
  status: AppointmentStatus;
  type?: AppointmentType;
  estimatedCost?: number;
  notes?: string;
};

export type ClinicAppointment = {
  clinicId: string;
  appointmentId: string;
  // Minimal display data to avoid extra API calls
  clinicName?: string;
  patientFullName?: string;
  appointmentDateTime?: string; // ISO 8601 string
  status: AppointmentStatus;
  type: AppointmentType;
  assignedSedationist?: string;
};

export type SedationistAppointment = {
  sedationistId: string;
  appointmentId: string;
  // Minimal display data to avoid extra API calls
  sedationistName?: string;
  patientFullName?: string;
  clinicName?: string;
  appointmentDateTime?: string; // ISO 8601 string
  status: AppointmentStatus;
  type: AppointmentType;
  estimatedDuration?: number;
};
