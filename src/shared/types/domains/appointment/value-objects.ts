import { DocumentType, PaymentStatus } from "./enums";

// Value objects for appointment domain

// Time slot value object for scheduling
export type TimeSlot = {
  startTime: string; // ISO 8601 string
  endTime: string; // ISO 8601 string
  duration: number; // Duration in minutes
  isAvailable: boolean;
  sedationistId?: string;
};

// Payment summary value object
export type PaymentSummary = {
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  currency: string;
  payerType: string;
  insuranceCoverage?: number;
  patientResponsibility?: number;
  paymentStatus: PaymentStatus;
  lastPaymentDate?: string; // ISO 8601 string
};

// Document summary value object
export type DocumentSummary = {
  totalDocuments: number;
  uploadedCount: number;
  generatedCount: number;
  pendingDocuments: DocumentType[];
  lastUploadDate?: string; // ISO 8601 string
  completionPercentage: number;
};
