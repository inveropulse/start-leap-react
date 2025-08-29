/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Title } from './Title';
export type PatientInfo = {
    title?: Title;
    name?: string | null;
    surname?: string | null;
    readonly fullName?: string | null;
    dateOfBirth?: string | null;
    phone?: string | null;
    email?: string | null;
    height?: number | null;
    heightFormat?: string | null;
    weight?: number | null;
    weightFormat?: string | null;
    occupation?: string | null;
    address?: string | null;
    postCode?: string | null;
};

