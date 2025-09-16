import {
  SedationistStatus,
  SedationistSpecialty,
  CertificationStatus,
} from "./enums";
import {
  SedationistCertification,
  SedationistAvailability,
  SedationistCase,
} from "./value-objects";

// Core sedationist entity
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
  yearsOfExperience?: number;
  rating?: number;
  avatar?: string;
  currentCaseload?: number;
}

export interface CreateSedationistData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  specialty?: SedationistSpecialty;
  specialties?: SedationistSpecialty[];
  licenseNumber: string;
  hospitalAffiliation?: string;
  experience?: number;
  biography?: string;
  profilePicture?: string;
  certifications?: SedationistCertification[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface UpdateSedationistData extends Partial<CreateSedationistData> {
  id: string;
  status?: SedationistStatus;
  specialties?: SedationistSpecialty[];
  notes?: string;
}
