/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AppointmentStatus } from './AppointmentStatus';
import type { BookingAttachment } from './BookingAttachment';
export type ClinicSedationBookingDto = {
    id?: string;
    status?: AppointmentStatus;
    patientId?: string;
    clinicId?: string;
    treatingDoctor?: string | null;
    doctorId?: string | null;
    appointmentId?: string;
    attachments?: BookingAttachment;
    reference?: string | null;
};

