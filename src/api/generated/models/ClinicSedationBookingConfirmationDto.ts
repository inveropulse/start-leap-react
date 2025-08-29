/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AppointmentStatus } from './AppointmentStatus';
import type { Attachment } from './Attachment';
export type ClinicSedationBookingConfirmationDto = {
    readonly id?: string;
    patientName?: string | null;
    patientTicketId?: string | null;
    treatingDoctor?: string | null;
    sedationistName?: string | null;
    appointmentReference?: string | null;
    clinicReference?: string | null;
    status?: AppointmentStatus;
    appointmentStart?: string;
    appointmentEnd?: string;
    patientId?: string;
    clinicId?: string;
    doctorId?: string | null;
    appointmentId?: string;
    sedationistId?: string;
    patientPackAttachments?: Array<Attachment> | null;
    sedationRecordAttachments?: Array<Attachment> | null;
    clinicAttachments?: Array<Attachment> | null;
};

