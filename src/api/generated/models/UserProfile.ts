/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClinicDto } from './ClinicDto';
import type { PatientDto } from './PatientDto';
import type { SedationistDto } from './SedationistDto';
export type UserProfile = {
    id?: string;
    userName?: string | null;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    readonly fullName?: string | null;
    phoneNumber?: string | null;
    roles?: Array<string> | null;
    permissions?: Array<string> | null;
    clinic?: ClinicDto;
    patient?: PatientDto;
    sedationist?: SedationistDto;
};

