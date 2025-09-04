// Local enums to avoid dependencies on @/api/generated/models
export enum Title {
  MR = "Mr",
  MRS = "Mrs",
  MS = "Ms",
  DR = "Dr",
  PROF = "Prof",
}

export enum Sex {
  MALE = "Male",
  FEMALE = "Female",
  OTHER = "Other",
}

export enum SmokingStatus {
  NEVER = "Never",
  FORMER = "Former",
  CURRENT = "Current",
}

export enum AlcoholStatus {
  NEVER = "Never",
  OCCASIONAL = "Occasional",
  REGULAR = "Regular",
  HEAVY = "Heavy",
}

// Patient data structure
export interface Patient {
  id: string;
  title: Title;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: Sex;
  email: string;
  phoneNumber: string;
  address: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  smokingStatus: SmokingStatus;
  alcoholStatus: AlcoholStatus;
  allergies?: string[];
  medications?: string[];
  medicalHistory?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Paginated response
export interface PatientPaginationResponse {
  items: Patient[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Request payloads
export interface CreatePatientRequest {
  title: Title;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: Sex;
  email: string;
  phoneNumber: string;
  address: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  smokingStatus: SmokingStatus;
  alcoholStatus: AlcoholStatus;
  allergies?: string[];
  medications?: string[];
  medicalHistory?: string;
  notes?: string;
}

export interface UpdatePatientRequest extends CreatePatientRequest {
  id: string;
}

// Query parameters
export interface PatientsQueryParams {
  search?: string;
  page?: number;
  pageSize?: number;
}