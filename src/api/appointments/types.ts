import {
  Appointment,
  BaseAppointmentFields,
  AppointmentPayment,
  AppointmentDocument,
  AppointmentActivity,
} from "@/shared/types/domains/appointment/entities";
import {
  AppointmentStatus,
  AppointmentType,
  AppointmentPriority,
  PayerType,
  PaymentMethod,
  PaymentStatus,
  DocumentType,
  ActivityType,
} from "@/shared/types/domains/appointment/enums";
import {
  PaymentSummary,
  DocumentSummary,
} from "@/shared/types/domains/appointment/value-objects";
import {
  PaginationResponse,
  ApiResponse,
  SearchParams,
} from "@/shared/types/shared-kernel/common";

export type AppointmentSearchParams = Omit<SearchParams, "sortBy"> & {
  patientId?: string;
  clinicId?: string;
  sedationistId?: string;
  status?: AppointmentStatus[];
  type?: AppointmentType[];
  priority?: AppointmentPriority[];
  startDate?: string; // ISO 8601 date
  endDate?: string; // ISO 8601 date
  payerType?: PayerType[];
  paymentStatus?: PaymentStatus[];
  sortBy?: keyof Appointment;
};

export type AppointmentSearchResponse = PaginationResponse<Appointment>;

export type CreateAppointmentRequest = BaseAppointmentFields;

export type CreateAppointmentResponse = ApiResponse<Appointment>;

export type UpdateAppointmentRequest = Partial<BaseAppointmentFields> & {
  id: string;
};

export type UpdateAppointmentResponse = ApiResponse<Appointment>;

export type AssignSedationistRequest = {
  appointmentId: string;
  sedationistId: string;
  notes?: string;
};

export type AssignSedationistResponse = ApiResponse<Appointment>;

// Appointment management
export type RescheduleAppointmentRequest = {
  appointmentId: string;
  newAppointmentDateTime: string; // ISO 8601 string
  duration?: number; // If duration changes
  reason: string;
  notifyParties?: boolean; // Whether to send notifications
};

export type RescheduleAppointmentResponse = ApiResponse<Appointment>;

export type CancelAppointmentRequest = {
  appointmentId: string;
  reason: string;
  refundRequired?: boolean;
  notifyParties?: boolean;
};

export type CancelAppointmentResponse = ApiResponse<void>;

// Payment management
export type AddPaymentRequest = {
  appointmentId: string;
  amount: number;
  currency?: string;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  notes?: string;
};

export type AddPaymentResponse = ApiResponse<AppointmentPayment>;

export type GetPaymentSummaryResponse = ApiResponse<PaymentSummary>;

// Document management
export type UploadDocumentRequest = {
  appointmentId: string;
  documentType: DocumentType;
  file: File; // For file upload
  notes?: string;
};

export type UploadDocumentResponse = ApiResponse<AppointmentDocument>;

export type GetDocumentSummaryResponse = ApiResponse<DocumentSummary>;

// Activity and audit trail
export type GetAppointmentActivitiesRequest = {
  appointmentId: string;
  activityTypes?: ActivityType[];
};

export type GetAppointmentActivitiesResponse =
  PaginationResponse<AppointmentActivity>;

export type AddManualActivityRequest = {
  appointmentId: string;
  description: string;
  notes?: string;
  activityData?: Record<string, any>;
};

export type AddManualActivityResponse = ApiResponse<AppointmentActivity>;

// Dashboard and analytics
export type AppointmentStatsRequest = {
  startDate?: string; // ISO 8601 date
  endDate?: string; // ISO 8601 date
  clinicId?: string;
  sedationistId?: string;
  groupBy?: "day" | "week" | "month";
};

export type AppointmentStats = {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowAppointments: number;
  averageDuration: number;
  totalRevenue: number;
  outstandingPayments: number;
  completionRate: number; // Percentage
  cancellationRate: number; // Percentage
  // Time-series data if groupBy is specified
  timeSeriesData?: Array<{
    period: string; // Date or period identifier
    count: number;
    revenue?: number;
  }>;
};

export type AppointmentStatsResponse = ApiResponse<AppointmentStats>;
