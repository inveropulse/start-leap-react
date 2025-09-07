import { ClinicStatus, ClinicType } from './enums';

// Core clinic entities
export interface Clinic {
  id?: string;
  name?: string | null;
  contactPersonName?: string | null;
  physicalAddress?: string | null;
  phoneNumber?: string | null;
  postalCode?: string | null;
  website?: string | null;
  emailAddress?: string | null;
  comments?: string | null;
  status?: ClinicStatus;
  type?: ClinicType;
  city?: string | null;
  country?: string | null;
  doctorCount?: number;
  activeAppointmentCount?: number;
  createdDateTime?: string | null;
  lastUpdatedDateTime?: string | null;
  address?: string;
  phone?: string;
  rating?: number;
  specialties?: string[];
  image?: string;
}

export interface ClinicDoctor {
  id: string;
  firstName: string;
  lastName: string;
  specialization?: string;
  phoneNumber?: string;
  email?: string;
  status: 'Active' | 'Inactive';
  joinedDate?: string;
  experience?: number;
  rating?: number;
  avatar?: string;
  credentials?: string[];
  clinicId?: string;
}

export interface CreateClinicRequest {
  name: string;
  contactPersonName?: string;
  physicalAddress?: string;
  phoneNumber?: string;
  postalCode?: string;
  website?: string;
  emailAddress?: string;
  comments?: string;
  status?: ClinicStatus;
  type?: ClinicType;
  city?: string;
  country?: string;
}

export interface UpdateClinicRequest extends Partial<CreateClinicRequest> {
  id: string;
}