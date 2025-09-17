// Core appointment domain enums
export enum AppointmentStatus {
  PENDING = "Pending",
  SCHEDULED = "Scheduled",
  CONFIRMED = "Confirmed",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled",
  NO_SHOW = "No Show",
  RESCHEDULED = "Rescheduled",
}

export enum AppointmentType {
  CONSULTATION = "Consultation",
  FOLLOW_UP = "Follow Up",
  PROCEDURE = "Procedure",
  EMERGENCY = "Emergency",
  ROUTINE_CHECK = "Routine Check",
}

export enum AppointmentPriority {
  LOW = "Low",
  NORMAL = "Normal",
  HIGH = "High",
  URGENT = "Urgent",
}

export enum DocumentType {
  PATIENT_PACK = "Patient Pack",
  CLINIC_DOCUMENT = "Clinic Document",
  SEDATION_RECORD = "Sedation Record",
  CONSENT_FORM = "Consent Form",
  MEDICAL_HISTORY = "Medical History",
  OTHER = "Other",
}

export enum DocumentStatus {
  UPLOADED = "Uploaded",
  GENERATED = "Generated",
}

export enum FileType {
  PDF = "PDF",
  CSV = "CSV",
  XML = "XML",
  EXCEL = "Excel",
  IMAGE = "Image",
  WORD = "Word Document",
}

export enum PayerType {
  INSURANCE = "Insurance",
  SELF_PAY = "Self Pay",
  CLINIC = "Clinic",
}

export enum PaymentMethod {
  NOT_SET = "Not Set",
  CREDIT_CARD = "Credit Card",
  CARD = "Card",
  BANK_TRANSFER = "Bank Transfer",
  CHEQUE = "Cheque",
  INSURANCE_DIRECT = "Insurance Direct",
  MEDICAL_AID = "Medical Aid",
  OTHER = "Other",
}

export enum Currency {
  GBP = "GBP",
  USD = "USD",
  EUR = "EUR",
}

export enum PaymentStatus {
  PENDING = "Pending",
  PARTIAL = "Partial",
  PAID = "Paid",
  OVERDUE = "Overdue",
  REFUNDED = "Refunded",
  FAILED = "failed",
}

export enum ActivityType {
  STATUS_CHANGE = "Status Change",
  PATIENT_NOTIFICATION = "Patient Notification",
  CLINIC_NOTIFICATION = "Clinic Notification",
  DOCUMENT_UPLOADED = "Document Uploaded",
  DOCUMENT_SIGNED = "Document Signed",
  PAYMENT_RECEIVED = "Payment Received",
  APPOINTMENT_CREATED = "Appointment Created",
  APPOINTMENT_UPDATED = "Appointment Updated",
  SEDATION_COMPLETED = "Sedation Completed",
  NOTES_ADDED = "Notes Added",
  MANUAL_NOTE = "Manual Note",
}
