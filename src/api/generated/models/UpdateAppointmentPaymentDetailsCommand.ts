/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Money } from './Money';
import type { PaymentMethod } from './PaymentMethod';
import type { PaymentStatus } from './PaymentStatus';
export type UpdateAppointmentPaymentDetailsCommand = {
    appointmentId?: string;
    paymentMethod?: PaymentMethod;
    amount?: Money;
    notes?: string | null;
    paymentStatus?: PaymentStatus;
};

