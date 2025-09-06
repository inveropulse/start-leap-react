export enum SedationistStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  ON_LEAVE = "on_leave",
  IN_TRAINING = "in_training",
}

export enum SedationistSpecialty {
  GENERAL_ANAESTHESIA = "general_anaesthesia",
  CONSCIOUS_SEDATION = "conscious_sedation",
  IV_SEDATION = "iv_sedation",
  NITROUS_OXIDE = "nitrous_oxide",
  PEDIATRIC_SEDATION = "pediatric_sedation",
  CARDIAC_SEDATION = "cardiac_sedation",
}

export enum CertificationStatus {
  VALID = "valid",
  EXPIRING_SOON = "expiring_soon",
  EXPIRED = "expired",
  PENDING_RENEWAL = "pending_renewal",
}

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
}

export interface SedationistSearchParams {
  search?: string;
  status?: SedationistStatus[];
  specialties?: SedationistSpecialty[];
  certificationStatus?: CertificationStatus[];
  availableOnly?: boolean;
  pageNo?: number;
  pageSize?: number;
}

export interface SedationistPaginationResponse {
  items: Sedationist[];
  totalCount: number;
  pageNo: number;
  pageSize: number;
  totalPages: number;
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

export interface SedationistFilters {
  search: string;
  status: SedationistStatus[];
  specialties: SedationistSpecialty[];
  certificationStatus: CertificationStatus[];
  availableOnly: boolean;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}