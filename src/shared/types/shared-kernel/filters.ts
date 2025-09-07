import { AppointmentStatus } from '../domains/appointment/enums';
import { UserStatus, Department, PermissionLevel } from '../domains/user-access/enums';
import { SedationistStatus, SedationistSpecialty, CertificationStatus } from '../domains/sedation/enums';
import { ClinicStatus, ClinicType } from '../domains/clinic/enums';
import { SearchParams } from './common';

// Cross-domain filter patterns
export interface AppointmentFilters {
  search: string;
  status: AppointmentStatus[];
  dateFrom?: string;
  dateTo?: string;
}

export interface UserFilters {
  search: string;
  status: UserStatus[];
  roles: string[];
  departments: Department[];
  permissionLevels: PermissionLevel[];
  lastLoginAfter: string;
}

export interface SedationistFilters {
  search: string;
  status: SedationistStatus[];
  specialties: SedationistSpecialty[];
  certificationStatus: CertificationStatus[];
  availableOnly: boolean;
}

export interface UserSearchParams extends SearchParams {
  search?: string;
  status?: UserStatus[];
  roles?: string[];
  departments?: Department[];
  permissionLevels?: PermissionLevel[];
  lastLoginAfter?: string;
  pageNo?: number;
  pageSize?: number;
}

export interface SedationistSearchParams extends SearchParams {
  search?: string;
  status?: SedationistStatus[];
  specialties?: SedationistSpecialty[];
  certificationStatus?: CertificationStatus[];
  availableOnly?: boolean;
  pageNo?: number;
  pageSize?: number;
}

export interface ClinicSearchParams extends SearchParams {
  search?: string;
  status?: ClinicStatus;
  type?: ClinicType;
  city?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PatientSearchParams extends SearchParams {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}