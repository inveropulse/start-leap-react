import { PatientTitle, PatientSex, PatientSmokingStatus, PatientAlcoholStatus } from '../enums/patient';

// Unified Patient entity interface
export interface Patient {
  id?: string;
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  bmi?: number;
  title?: PatientTitle;
  dateOfBirth?: string;
  sex?: PatientSex;
  age?: number;
  address?: string | null;
  town?: string | null;
  country?: string | null;
  postCode?: string | null;
  phoneNumber?: string | null;
  alternativePhoneNumber?: string | null;
  businessName?: string | null;
  email?: string | null;
  medicalHistory?: string | null;
  allergies?: string | null;
  medications?: string | null;
  anestheticHistory?: string | null;
  asaClassification?: number;
  smokingStatus?: PatientSmokingStatus;
  alcoholStatus?: PatientAlcoholStatus;
  lastMealAgoInHours?: number | null;
  lastFluidAgoInHours?: number | null;
  occupation?: string | null;
  heightFormat?: string | null;
  height?: number;
  weightFormat?: string | null;
  weight?: number;
  ticketId?: string | null;
  notes?: string | null;
  createdDateTime?: string | null;
  smokingNote?: string | null;
  alcoholNote?: string | null;
  avatar?: string;
}

export interface CreatePatientRequest {
  firstName: string;
  lastName: string;
  title?: PatientTitle;
  dateOfBirth?: string;
  sex?: PatientSex;
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
  smokingStatus?: PatientSmokingStatus;
  alcoholStatus?: PatientAlcoholStatus;
  lastMealAgoInHours?: number;
  lastFluidAgoInHours?: number;
  occupation?: string;
  heightFormat?: string;
  height?: number;
  weightFormat?: string;
  weight?: number;
  notes?: string;
  smokingNote?: string;
  alcoholNote?: string;
}

export interface UpdatePatientRequest extends Partial<CreatePatientRequest> {
  id: string;
}