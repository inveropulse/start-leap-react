/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Money } from './Money';
import type { PaymentMethod } from './PaymentMethod';
import type { PaymentStatus } from './PaymentStatus';
export type AppointmentPaymentDetailsDto = {
    id: string;
    appointmentId: string;
    confirmedBy: string;
    confirmedOn: string;
    paymentMethod: PaymentMethod;
    amount: Money;
    notes: string;
    paymentReference: string;
    paymentStatus: PaymentStatus;
};

