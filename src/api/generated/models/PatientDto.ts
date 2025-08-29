/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AlcoholStatus } from './AlcoholStatus';
import type { Sex } from './Sex';
import type { SmokingStatus } from './SmokingStatus';
import type { Title } from './Title';
export type PatientDto = {
    id?: string;
    firstName?: string | null;
    lastName?: string | null;
    readonly fullName?: string | null;
    bmi?: number;
    title?: Title;
    dateOfBirth?: string;
    sex?: Sex;
    age?: number;
    address?: string | null;
    town?: string | null;
    country?: string | null;
    postCode?: string | null;
    phoneNumber?: string | null;
    alternativePhoneNumber?: string | null;
    businessName?: string | null;
    email?: string | null;
    medicalHistory?: string | null;
    allergies?: string | null;
    medications?: string | null;
    anestheticHistory?: string | null;
    asaClassification?: number;
    smokingStatus?: SmokingStatus;
    alcoholStatus?: AlcoholStatus;
    lastMealAgoInHours?: number | null;
    lastFluidAgoInHours?: number | null;
    occupation?: string | null;
    heightFormat?: string | null;
    height?: number;
    weightFormat?: string | null;
    weight?: number;
    ticketId?: string | null;
    notes?: string | null;
    createdDateTime?: string | null;
    smokingNote?: string | null;
    alcoholNote?: string | null;
};

