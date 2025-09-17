import { CertificationStatus, DayOfWeek, AvailabilityStatus } from "./enums";

// Certification tracking for compliance (future use)
export type SedationistCertification = {
  id: string;
  name: string;
  issuingBody: string;
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
  status: CertificationStatus;
  documentUrl?: string;
};

// Availability tracking for assignment workflow
export type SedationistAvailability = {
  id: string;
  sedationistId: string;
  dayOfWeek: DayOfWeek; // Fixed: Now uses proper enum instead of magic number
  startTime: string; // ISO datetime string (e.g., "2024-01-15T08:00:00Z")
  endTime: string; // ISO datetime string (e.g., "2024-01-15T17:00:00Z")
  status: AvailabilityStatus; // Reason for unavailability
  notes?: string;
};
