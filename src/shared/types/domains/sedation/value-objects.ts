import {
  CertificationStatus,
  SedationistStatus,
  SedationistSpecialty,
} from "./enums";

// Sedation domain value objects
export interface SedationistCertification {
  id: string;
  name: string;
  issuingBody: string;
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
  status: CertificationStatus;
  documentUrl?: string;
}

export interface SedationistAvailability {
  id: string;
  sedationistId: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface SedationistCase {
  id: string;
  appointmentId: string;
  procedureDate: string;
  procedureType: string;
  duration: number; // minutes
  patientName: string;
  outcome: string;
  notes?: string;
}

// Search and filter types
export interface SedationistFilters {
  search: string;
  status: SedationistStatus[];
  specialty: SedationistSpecialty[];
  location: string;
  certificationStatus: CertificationStatus[];
  availableToday: boolean;
  showInactive: boolean;
}
