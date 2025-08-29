/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AppointmentStatus } from './AppointmentStatus';
import type { Attachment } from './Attachment';
import type { Money } from './Money';
import type { PatientPackStatus } from './PatientPackStatus';
import type { Title } from './Title';
export type DiaryAppointmentDto = {
    id?: string;
    billTo?: string | null;
    callerName?: string | null;
    isPatientPackCompleted?: boolean | null;
    patientPackStatus?: PatientPackStatus;
    patientTitle?: Title;
    patientName?: string | null;
    patientPhoneNumber?: string | null;
    patientEmail?: string | null;
    patientDOB?: string | null;
    ticketId?: string | null;
    doctorName?: string | null;
    doctorEmail?: string | null;
    doctorPhone?: string | null;
    sedationistName?: string | null;
    sedationistPhone?: string | null;
    sedationistEmail?: string | null;
    sedationistFee?: Money;
    clinicName?: string | null;
    clinicAddress?: string | null;
    clinicPostalCode?: string | null;
    clinicPhone?: string | null;
    clinicEmail?: string | null;
    treatment?: string | null;
    procedure?: string | null;
    notes?: string | null;
    status?: AppointmentStatus;
    start?: string;
    end?: string;
    sedationistId?: string;
    patientId?: string;
    clinicId?: string;
    doctorId?: string;
    sedationDetailId?: string | null;
    bookingFormReceived?: boolean;
    patientPackReceived?: boolean;
    paymentReceived?: boolean;
    readonly reference?: string | null;
    clinicAttachments?: Array<Attachment> | null;
    patientPackAttachments?: Array<Attachment> | null;
};

