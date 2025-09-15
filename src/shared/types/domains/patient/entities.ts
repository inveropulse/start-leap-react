import {
  PatientTitle,
  PatientSex,
  PatientSmokingStatus,
  PatientAlcoholStatus,
} from "./enums";

type BasePatientFields = {
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
};

export type Patient = Partial<BasePatientFields> & {
  id?: string;
  fullName?: string | null;
  bmi?: number;
  age?: number;
  ticketId?: string | null;
  createdDateTime?: string | null;
  avatar?: string;
};

export type CreatePatientRequest = Pick<
  BasePatientFields,
  "firstName" | "lastName"
> &
  Partial<Omit<BasePatientFields, "firstName" | "lastName">>;

export type UpdatePatientRequest = Partial<BasePatientFields> & {
  id: string;
};
