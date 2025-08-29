/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseDoctorRequest } from './BaseDoctorRequest';
import type { UpdateDoctorRequest } from './UpdateDoctorRequest';
export type UpdateClinicCommand = {
    name?: string | null;
    contactPersonName?: string | null;
    physicalAddress?: string | null;
    phoneNumber?: string | null;
    postalCode?: string | null;
    website?: string | null;
    emailAddress?: string | null;
    comments?: string | null;
    id?: string;
    updateDoctorRequests?: Array<UpdateDoctorRequest> | null;
    deleteDoctorRequests?: Array<string> | null;
    createDoctorRequests?: Array<BaseDoctorRequest> | null;
};

