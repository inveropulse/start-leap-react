import { ClinicStatus, ClinicType, MedicalSpecialty } from "./enums";

export type BaseClinicFields = {
  name: string;
  address?: string;
  town?: string;
  country?: string;
  city?: string;
  postCode?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  contactPersonName?: string;
  contactPersonEmail?: string;
  contactPersonPhone?: string;
  specialties?: MedicalSpecialty[];
  operatingHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  type?: ClinicType;
  accreditations?: string[];
  notes?: string;
};

export type Clinic = Partial<BaseClinicFields> & {
  id?: string;
  status?: ClinicStatus;
  totalDoctors?: number;
  totalPatients?: number;
  totalAppointments?: number;
  activeAppointmentsCount?: number;
  lastActivityDate?: string;
  createdDateTime?: string;
  updatedDateTime?: string;
};
