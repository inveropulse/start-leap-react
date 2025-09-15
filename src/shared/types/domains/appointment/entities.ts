import {
  AppointmentStatus,
  AppointmentType,
  DocumentType,
  DocumentStatus,
  ActivityType,
} from "./enums";
import { PaymentMethod, PaymentStatus } from "../payment/enums";
import { Patient } from "../patient/entities";
import { ClinicDoctor, Clinic } from "../clinic/entities";

// Core appointment entity
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
