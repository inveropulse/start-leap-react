/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AppointmentStatus } from './AppointmentStatus';
import type { AvailabilityStatus } from './AvailabilityStatus';
export type UpdateDiaryAvailabilityCommand = {
    id?: string;
    sedationistId?: string;
    notes?: string | null;
    availabilityStatus?: AvailabilityStatus;
    appointmentStatus?: AppointmentStatus;
    start?: string;
    end?: string;
};

