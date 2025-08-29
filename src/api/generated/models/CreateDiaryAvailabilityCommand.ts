/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AvailabilityStatus } from './AvailabilityStatus';
export type CreateDiaryAvailabilityCommand = {
    sedationistId?: string;
    notes?: string | null;
    availabilityStatus?: AvailabilityStatus;
    start?: string;
    end?: string;
};

