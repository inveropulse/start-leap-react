/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BloodPressure } from './BloodPressure';
import type { Cannulation } from './Cannulation';
import type { FieldOfSurgery } from './FieldOfSurgery';
import type { FileType } from './FileType';
import type { SedationDetailStatus } from './SedationDetailStatus';
export type SedationDetailDto = {
    id?: string;
    reason?: string | null;
    procedure?: string | null;
    surgeon?: string | null;
    consentSigned?: boolean;
    sedationist?: string | null;
    nurse?: string | null;
    fieldOfSurgery?: FieldOfSurgery;
    status?: SedationDetailStatus;
    comments?: string | null;
    considerations?: string | null;
    fieldOfSurgeryNote?: string | null;
    patientId?: string;
    bloodPressure?: BloodPressure;
    pulseRate?: number | null;
    cO2EndTidal?: number | null;
    ecg?: boolean;
    saO2?: number | null;
    respiratoryRate?: number | null;
    bis?: number | null;
    cannulation?: Cannulation;
    pdfUrl?: string | null;
    fileType?: FileType;
    replayCount?: number;
    appointmentStartDateTime?: string | null;
    appointmentEndDateTime?: string | null;
    clinicName?: string | null;
    clinicPhoneNumber?: string | null;
    createdDateTime?: string;
};

