/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttachmentDto } from './AttachmentDto';
import type { PatientPackData } from './PatientPackData';
export type PatientPackDto = {
    patientId: string;
    appointmentId: string;
    attachments: Array<AttachmentDto>;
    patientPackData?: PatientPackData;
};

