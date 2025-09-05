// Multi-step appointment booking wizard types
export enum AppointmentType {
  CONSULTATION = 'consultation',
  FOLLOW_UP = 'follow_up',
  PROCEDURE = 'procedure',
  EMERGENCY = 'emergency',
  ROUTINE_CHECK = 'routine_check'
}

export interface WizardPatient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  avatar?: string;
}

export interface WizardClinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  specialties: string[];
  image?: string;
}

export interface WizardDoctor {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  clinicId: string;
  experience: number;
  rating: number;
  avatar?: string;
  credentials: string[];
}

export interface WizardSedationist {
  id: string;
  firstName: string;
  lastName: string;
  specialties: string[];
  experience: number;
  rating: number;
  avatar?: string;
  certifications: string[];
  successRate: number;
  currentCaseload: number;
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

export interface WizardData {
  patient?: WizardPatient;
  clinic?: WizardClinic;
  doctor?: WizardDoctor;
  sedationist?: WizardSedationist;
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