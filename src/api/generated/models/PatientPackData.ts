/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AppointmentDetails } from './AppointmentDetails';
import type { DoctorAndSedationistInfo } from './DoctorAndSedationistInfo';
import type { EscortInfo } from './EscortInfo';
import type { MedicalHistoryInfo } from './MedicalHistoryInfo';
import type { PatientConditionsInfo } from './PatientConditionsInfo';
import type { PatientInfo } from './PatientInfo';
import type { PrivacyAndConsent } from './PrivacyAndConsent';
export type PatientPackData = {
    patientInfo?: PatientInfo;
    appointmentDetails?: AppointmentDetails;
    doctorAndSedationistInfo?: DoctorAndSedationistInfo;
    medicalHistoryInfo?: MedicalHistoryInfo;
    patientConditionsInfo?: PatientConditionsInfo;
    escortInfo?: EscortInfo;
    privacyAndConsent?: PrivacyAndConsent;
};

