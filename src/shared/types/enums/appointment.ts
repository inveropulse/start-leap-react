// Shared appointment-related enums
export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed', 
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
  RESCHEDULED = 'rescheduled'
}

export enum AppointmentType {
  CONSULTATION = 'consultation',
  FOLLOW_UP = 'follow_up',
  PROCEDURE = 'procedure',
  EMERGENCY = 'emergency',
  ROUTINE_CHECK = 'routine_check'
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