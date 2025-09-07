import { SedationistStatus, SedationistSpecialty, CertificationStatus } from '../enums/sedationist';

// Unified Sedationist entity interface
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

export interface Sedationist {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  licenseNumber: string;
  status: SedationistStatus;
  specialties: SedationistSpecialty[];
  certifications: SedationistCertification[];
  availability: SedationistAvailability[];
  recentCases: SedationistCase[];
  joinDate: string;
  lastActiveDate?: string;
  totalProcedures: number;
  successRate: number;
  patientRating: number;
  notes?: string;
  profileImageUrl?: string;
  experience?: number;
  rating?: number;
  avatar?: string;
  currentCaseload?: number;
}

export interface CreateSedationistData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  licenseNumber: string;
  specialties: SedationistSpecialty[];
  certifications: Omit<SedationistCertification, 'id' | 'status'>[];
}

export interface UpdateSedationistData {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  licenseNumber?: string;
  status?: SedationistStatus;
  specialties?: SedationistSpecialty[];
  notes?: string;
}