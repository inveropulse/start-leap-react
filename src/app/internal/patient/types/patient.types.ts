// Local enum definitions
export enum Title {
  MR = "MR",
  MRS = "MRS", 
  MS = "MS",
  DR = "DR"
}

export enum Sex {
  MALE = "MALE",
  FEMALE = "FEMALE"
}

export enum SmokingStatus {
  NEVER = "NEVER",
  FORMER = "FORMER",
  YES = "YES"
}

export enum AlcoholStatus {
  NEVER = "NEVER", 
  FORMER = "FORMER",
  YES = "YES"
}

export interface Patient {
  id: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  bmi: number;
  title: Title;
  dateOfBirth: string;
  sex: Sex;
  age: number;
  address: string | null;
  town: string | null;
  country: string | null;
  postCode: string | null;
  phoneNumber: string | null;
  alternativePhoneNumber: string | null;
  businessName: string | null;
  email: string | null;
  medicalHistory: string | null;
  allergies: string | null;
  medications: string | null;
  anestheticHistory: string | null;
  asaClassification: number;
  smokingStatus: SmokingStatus;
  alcoholStatus: AlcoholStatus;
  lastMealAgoInHours: number | null;
  lastFluidAgoInHours: number | null;
  occupation: string | null;
  heightFormat: string | null;
  height: number;
  weightFormat: string | null;
  weight: number;
  ticketId: string | null;
  notes: string | null;
  createdDateTime: string | null;
  smokingNote: string | null;
  alcoholNote: string | null;
}

export interface PatientPaginationResponse {
  payload: Patient[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface CreatePatientRequest {
  firstName: string;
  lastName: string;
  title: Title;
  dateOfBirth: string;
  sex: Sex;
  address?: string;
  town?: string;
  country?: string;
  postCode?: string;
  phoneNumber?: string;
  alternativePhoneNumber?: string;
  businessName?: string;
  email?: string;
  medicalHistory?: string;
  allergies?: string;
  medications?: string;
  anestheticHistory?: string;
  asaClassification?: number;
  smokingStatus?: SmokingStatus;
  alcoholStatus?: AlcoholStatus;
  occupation?: string;
  height?: number;
  heightFormat?: string;
  weight?: number;
  weightFormat?: string;
  notes?: string;
  smokingNote?: string;
  alcoholNote?: string;
}

export interface UpdatePatientRequest extends Partial<CreatePatientRequest> {
  id: string;
}

export interface PatientsQueryParams {
  searchText?: string;
  pageNo?: number;
  pageSize?: number;
}