import {
  SedationistStatus,
  SedationistSpecialty,
  SedationistTitle,
} from "./enums";
import { SedationistCertification } from "./value-objects";

// Base sedationist fields - core business data
export type BaseSedationistFields = {
  title?: SedationistTitle;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  licenseNumber: string;
  status: SedationistStatus;
  specialties: SedationistSpecialty[];
  certifications: SedationistCertification[];
  joinDate: string;
  notes?: string;
};

// Extended sedationist entity with computed/system fields
export type Sedationist = Partial<BaseSedationistFields> & {
  id?: string;
  fullName?: string; // Computed from title + firstName + lastName
  lastActiveDate?: string;
  totalProcedures?: number;
  successRate?: number;
  patientRating?: number;
  yearsExperience?: number;
  profileImageUrl?: string;
  currentCaseload?: number;
  createdDateTime?: string;
  updatedDateTime?: string;
};
