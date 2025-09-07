import { AppointmentStatus, AppointmentType, DocumentType, DocumentStatus, ActivityType } from '../enums/appointment';
import { PaymentMethod, PaymentStatus } from '../enums/payment';
import { Patient } from './patient';
import { ClinicDoctor, Clinic } from './clinic';
import { Sedationist } from './sedationist';

// Unified Appointment entity interface
export interface Appointment {
  id: string;
  reference: string;
  patient: Patient;
  doctor: ClinicDoctor;
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

export interface AppointmentDetails {
  date: string;
  time: string;
  duration: number;
  type: string;
  procedure: string;
  estimatedCost: number;
  callerName: string;
  bookingFormReceived: boolean;
  patientPackReceived: boolean;
  paymentReceived: boolean;
  notes?: string;
}

export interface AppointmentDocument {
  id: string;
  appointmentId: string;
  type: DocumentType;
  name: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: string;
  status: DocumentStatus;
  url?: string;
  notes?: string;
}

export interface AppointmentActivity {
  id: string;
  appointmentId: string;
  type: ActivityType;
  status: string;
  title: string;
  description: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface AppointmentPayment {
  id: string;
  appointmentId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  reference?: string;
  notes?: string;
  paidBy?: string;
  paidAt?: string;
  confirmedBy?: string;
  confirmedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentManagement {
  appointment: Appointment;
  documents: AppointmentDocument[];
  activities: AppointmentActivity[];
  payments: AppointmentPayment[];
}

export interface AppointmentStats {
  todayScheduled: number;
  pending: number;
  completed: number;
  activeClinics: number;
}

// Wizard specific interfaces
export interface WizardData {
  patient?: Patient;
  clinic?: Clinic;
  doctor?: ClinicDoctor;
  sedationist?: Sedationist;
  appointmentDetails?: AppointmentDetails;
}

export enum WizardStep {
  PATIENT_SELECTION = 1,
  CLINIC_SELECTION = 2,
  DOCTOR_SELECTION = 3,
  SEDATIONIST_SELECTION = 4,
  APPOINTMENT_DETAILS = 5,
  REVIEW_CONFIRM = 6,
}

export interface StepValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface WizardStepProps {
  data: WizardData;
  onDataChange: (data: Partial<WizardData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  validate?: () => StepValidationResult;
}