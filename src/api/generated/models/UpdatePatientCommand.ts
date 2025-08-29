/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AlcoholStatus } from './AlcoholStatus';
import type { Sex } from './Sex';
import type { SmokingStatus } from './SmokingStatus';
import type { Title } from './Title';
export type UpdatePatientCommand = {
    firstName?: string | null;
    lastName?: string | null;
    readonly fullName?: string | null;
    title?: Title;
    dateOfBirth?: string;
    sex?: Sex;
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
    notes?: string | null;
    heightFormat?: string | null;
    height?: number | null;
    weightFormat?: string | null;
    weight?: number | null;
    smokingNote?: string | null;
    alcoholNote?: string | null;
    hasSynced?: boolean;
    id?: string;
};

