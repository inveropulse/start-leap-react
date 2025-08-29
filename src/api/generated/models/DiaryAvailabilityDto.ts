/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AvailabilityStatus } from './AvailabilityStatus';
export type DiaryAvailabilityDto = {
    id?: string;
    sedationistId?: string;
    sedationistName?: string | null;
    notes?: string | null;
    status?: AvailabilityStatus;
    start?: string;
    end?: string;
    readonly sedationistEmail?: string | null;
};

