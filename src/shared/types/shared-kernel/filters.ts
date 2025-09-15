import {
  SedationistStatus,
  SedationistSpecialty,
  CertificationStatus,
} from "../domains/sedation/enums";
import { SearchParams } from "./common";
import {
  UserStatus,
  Department,
  PermissionLevel,
} from "../domains/user-access/enums";
import { AppointmentStatus } from "../domains/appointment/enums";
import { ClinicStatus, ClinicType } from "../domains/clinic/enums";

// Cross-domain filter patterns
export interface AppointmentSearchParams extends SearchParams {
  status: AppointmentStatus[];
  dateFrom?: string;
  dateTo?: string;
}

export interface UserSearchParams extends SearchParams {
  status?: UserStatus[];
  roles?: string[];
  departments?: Department[];
  permissionLevels?: PermissionLevel[];
  lastLoginAfter?: string;
}

export interface SedationistSearchParams extends SearchParams {
  availableOnly?: boolean;
  status?: SedationistStatus[];
  specialties?: SedationistSpecialty[];
  certificationStatus?: CertificationStatus[];
}

export interface ClinicSearchParams extends SearchParams {
  status?: ClinicStatus;
  type?: ClinicType;
  city?: string;
}

export interface PatientSearchParams extends SearchParams {}
