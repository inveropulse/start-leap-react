/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DrugEventDto } from './DrugEventDto';
export type DrugsAppliedDto = {
    id?: string;
    time?: string | null;
    appliedDrugsOverTime?: Array<DrugEventDto> | null;
    comment?: string | null;
};

