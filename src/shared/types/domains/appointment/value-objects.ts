import { DocumentType, DocumentStatus, ActivityType } from './enums';
import { PaymentMethod, PaymentStatus } from '../payment/enums';

// Value objects for appointment domain
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