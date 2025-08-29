/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateClinicUserRequest } from './CreateClinicUserRequest';
import type { CreateDoctorRequest } from './CreateDoctorRequest';
export type CreateClinicCommand = {
    name?: string | null;
    contactPersonName?: string | null;
    physicalAddress?: string | null;
    phoneNumber?: string | null;
    postalCode?: string | null;
    website?: string | null;
    emailAddress?: string | null;
    comments?: string | null;
    createClinicUserRequest?: CreateClinicUserRequest;
    createDoctorRequests?: Array<CreateDoctorRequest> | null;
};

