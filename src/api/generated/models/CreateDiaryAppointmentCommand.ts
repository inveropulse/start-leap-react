/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Money } from './Money';
export type CreateDiaryAppointmentCommand = {
    start?: string;
    end?: string;
    callerName?: string | null;
    sedationistFee?: Money;
    billTo?: string | null;
    sedationistId?: string;
    patientId?: string;
    clinicId?: string;
    doctorId?: string;
    treatment?: string | null;
    procedure?: string | null;
    notes?: string | null;
    bookingFormReceived?: boolean;
    patientPackReceived?: boolean;
    paymentReceived?: boolean;
};

