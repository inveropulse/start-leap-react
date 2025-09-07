import { AppointmentStatus } from '../enums/appointment';
import { UserStatus, Department, PermissionLevel } from '../enums/user';
import { SedationistStatus, SedationistSpecialty, CertificationStatus } from '../enums/sedationist';
import { ClinicStatus, ClinicType } from '../enums/clinic';
import { SearchParams } from '../common/pagination';

// Shared filter interfaces
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