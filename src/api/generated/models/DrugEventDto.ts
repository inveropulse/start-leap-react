/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Unit } from './Unit';
export type DrugEventDto = {
    id?: string;
    minute?: number;
    hour?: number;
    drug?: string | null;
    batchNumber?: string | null;
    expiryDateTime?: string | null;
    infusion?: boolean;
    dosageAmount?: number | null;
    dosageUnit?: Unit;
    isSummary?: boolean;
};

