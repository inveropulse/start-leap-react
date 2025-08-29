/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RecoveryType } from './RecoveryType';
export type SedationReportReceiptDto = {
    id?: string;
    recoveryType?: RecoveryType;
    suitableForFutureSedation?: boolean;
    reasonNotSuitableForFutureSedation?: string | null;
    aldreteScore?: number | null;
    drugsPrescribed?: boolean;
    comments?: string | null;
    signedBy?: string | null;
    verbalAdviceGiven?: boolean;
    writtenAdviceGiven?: boolean;
    escort?: string | null;
    instructionsGivenToEscort?: boolean;
    ivCannulaRemoved?: boolean;
    reasonIVCannulaNotRemoved?: string | null;
    receiptEmails?: string | null;
    timeInHrsForCompletedSedation?: string | null;
    timeInMinsForCompletedSedation?: string | null;
    durationOfMonitoredRecovery?: number | null;
    timeInHrsForDischargeSedation?: string | null;
    timeInMinsForDischargeSedation?: string | null;
    additionalNotes?: string | null;
    sedationDetailId?: string;
};

