// Mock service for appointment management features
import { 
  AppointmentDocument, 
  AppointmentActivity, 
  AppointmentPayment,
  DocumentType,
  DocumentStatus,
  ActivityType,
  PaymentMethod,
  PaymentStatus
} from '../types/management.types';

// Mock data generators
function generateMockDocuments(appointmentId: string): AppointmentDocument[] {
  const documents: AppointmentDocument[] = [];
  
  // Patient Pack (always present)
  documents.push({
    id: `doc-${appointmentId}-patient-pack`,
    appointmentId,
    type: DocumentType.PATIENT_PACK,
    name: 'Patient Pack',
    fileName: 'patient_pack_form.pdf',
    fileSize: 245760, // 240KB
    mimeType: 'application/pdf',
    uploadedBy: 'System',
    uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: Math.random() > 0.5 ? DocumentStatus.SIGNED : DocumentStatus.UPLOADED,
    url: '/mock-documents/patient_pack.pdf'
  });

  // Optional clinic documents
  if (Math.random() > 0.4) {
    documents.push({
      id: `doc-${appointmentId}-clinic-1`,
      appointmentId,
      type: DocumentType.CLINIC_DOCUMENT,
      name: 'Pre-Procedure Instructions',
      fileName: 'pre_procedure_instructions.pdf',
      fileSize: 125440,
      mimeType: 'application/pdf',
      uploadedBy: 'Dr. Smith',
      uploadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: DocumentStatus.UPLOADED,
      url: '/mock-documents/pre_procedure.pdf',
      notes: 'Please review before appointment'
    });
  }

  // Sedation record (only for completed appointments)
  if (Math.random() > 0.7) {
    documents.push({
      id: `doc-${appointmentId}-sedation`,
      appointmentId,
      type: DocumentType.SEDATION_RECORD,
      name: 'Sedation Record',
      fileName: 'sedation_record.pdf',
      fileSize: 189340,
      mimeType: 'application/pdf',
      uploadedBy: 'System Auto-Generated',
      uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: DocumentStatus.COMPLETED,
      url: '/mock-documents/sedation_record.pdf'
    });
  }

  return documents;
}

function generateMockActivities(appointmentId: string): AppointmentActivity[] {
  const activities: AppointmentActivity[] = [];
  const now = new Date();
  
  // Appointment created
  activities.push({
    id: `activity-${appointmentId}-1`,
    appointmentId,
    type: ActivityType.APPOINTMENT_CREATED,
    status: 'completed',
    title: 'Appointment Created',
    description: 'Appointment was successfully created in the system',
    createdBy: 'System',
    createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: { source: 'booking_wizard' }
  });

  // Patient notified
  activities.push({
    id: `activity-${appointmentId}-2`,
    appointmentId,
    type: ActivityType.PATIENT_NOTIFICATION,
    status: 'completed',
    title: 'Patient Notified',
    description: 'Confirmation email sent to patient',
    createdBy: 'System',
    createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
    metadata: { email: 'patient@example.com', template: 'booking_confirmation' }
  });

  // Clinic notified  
  activities.push({
    id: `activity-${appointmentId}-3`,
    appointmentId,
    type: ActivityType.CLINIC_NOTIFICATION,
    status: 'completed',
    title: 'Clinic Notified',
    description: 'Appointment details shared with clinic staff',
    createdBy: 'System',
    createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString(),
    metadata: { clinic_id: 'clinic-123' }
  });

  // Document uploaded
  activities.push({
    id: `activity-${appointmentId}-4`,
    appointmentId,
    type: ActivityType.DOCUMENT_UPLOADED,
    status: 'completed',
    title: 'Patient Pack Uploaded',
    description: 'Patient pack document has been uploaded',
    createdBy: 'System',
    createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: { document_type: 'patient_pack' }
  });

  // Status changes
  if (Math.random() > 0.5) {
    activities.push({
      id: `activity-${appointmentId}-5`,
      appointmentId,
      type: ActivityType.STATUS_CHANGE,
      status: 'completed',
      title: 'Status Updated',
      description: 'Appointment status changed from Pending to Confirmed',
      createdBy: 'Dr. Johnson',
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      metadata: { from: 'Pending', to: 'Confirmed' }
    });
  }

  return activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function generateMockPayments(appointmentId: string): AppointmentPayment[] {
  const payments: AppointmentPayment[] = [];
  
  // Primary payment
  payments.push({
    id: `payment-${appointmentId}-1`,
    appointmentId,
    amount: Math.floor(Math.random() * 500) + 150,
    currency: 'GBP',
    method: PaymentMethod.CARD,
    status: Math.random() > 0.3 ? PaymentStatus.PAID : PaymentStatus.PENDING,
    reference: `PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    notes: 'Main procedure fee',
    paidBy: 'John Smith',
    paidAt: Math.random() > 0.3 ? new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    confirmedBy: Math.random() > 0.3 ? 'Admin User' : undefined,
    confirmedAt: Math.random() > 0.3 ? new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString() : undefined,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  });

  // Optional sedation fee
  if (Math.random() > 0.6) {
    payments.push({
      id: `payment-${appointmentId}-2`,
      appointmentId,
      amount: Math.floor(Math.random() * 200) + 50,
      currency: 'GBP',
      method: PaymentMethod.CASH,
      status: PaymentStatus.PENDING,
      notes: 'Sedation fee',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  return payments;
}

// Simulate API delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const appointmentManagementService = {
  async getAppointmentDocuments(appointmentId: string): Promise<AppointmentDocument[]> {
    await delay(200);
    return generateMockDocuments(appointmentId);
  },

  async getAppointmentActivities(appointmentId: string): Promise<AppointmentActivity[]> {
    await delay(250);
    return generateMockActivities(appointmentId);
  },

  async getAppointmentPayments(appointmentId: string): Promise<AppointmentPayment[]> {
    await delay(150);
    return generateMockPayments(appointmentId);
  },

  async uploadDocument(appointmentId: string, file: File, type: DocumentType): Promise<AppointmentDocument> {
    await delay(1000);
    
    const document: AppointmentDocument = {
      id: `doc-${Date.now()}`,
      appointmentId,
      type,
      name: file.name,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      uploadedBy: 'Current User',
      uploadedAt: new Date().toISOString(),
      status: DocumentStatus.UPLOADED,
      url: `/mock-documents/${file.name}`
    };

    return document;
  },

  async addPayment(appointmentId: string, payment: Partial<AppointmentPayment>): Promise<AppointmentPayment> {
    await delay(500);
    
    const newPayment: AppointmentPayment = {
      id: `payment-${Date.now()}`,
      appointmentId,
      amount: payment.amount || 0,
      currency: 'GBP',
      method: payment.method || PaymentMethod.CASH,
      status: PaymentStatus.PAID,
      reference: payment.reference,
      notes: payment.notes,
      paidBy: payment.paidBy,
      paidAt: new Date().toISOString(),
      confirmedBy: 'Current User',
      confirmedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return newPayment;
  },

  async addActivity(appointmentId: string, activity: Partial<AppointmentActivity>): Promise<AppointmentActivity> {
    await delay(200);
    
    const newActivity: AppointmentActivity = {
      id: `activity-${Date.now()}`,
      appointmentId,
      type: activity.type || ActivityType.NOTES_ADDED,
      status: 'completed',
      title: activity.title || 'Activity',
      description: activity.description || '',
      notes: activity.notes,
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
      metadata: activity.metadata
    };

    return newActivity;
  }
};