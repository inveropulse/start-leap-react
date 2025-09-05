// Local appointment types - self-contained, not referencing external API files
export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed', 
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
  RESCHEDULED = 'rescheduled'
}

export enum AppointmentType {
  CONSULTATION = 'consultation',
  FOLLOW_UP = 'follow_up',
  PROCEDURE = 'procedure',
  EMERGENCY = 'emergency',
  ROUTINE_CHECK = 'routine_check'
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
}

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
}

export interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
}

export interface Appointment {
  id: string;
  reference: string;
  patient: Patient;
  doctor: Doctor;
  clinic: Clinic;
  appointmentDate: string;
  appointmentTime: string;
  duration: number; // minutes
  type: AppointmentType;
  status: AppointmentStatus;
  procedure: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentFilters {
  search: string;
  status: AppointmentStatus[];
  dateFrom?: string;
  dateTo?: string;
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export interface AppointmentStats {
  todayScheduled: number;
  pending: number;
  completed: number;
  activeClinics: number;
}