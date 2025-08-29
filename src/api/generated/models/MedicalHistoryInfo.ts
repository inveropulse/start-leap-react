/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Allergy } from './Allergy';
import type { GeneralHealth } from './GeneralHealth';
import type { LifestyleItem } from './LifestyleItem';
import type { ProceduralHistory } from './ProceduralHistory';
import type { WomenSpecific } from './WomenSpecific';
export type MedicalHistoryInfo = {
    lifestyleInfo?: Array<LifestyleItem> | null;
    proceduralHistory?: Array<ProceduralHistory> | null;
    generalHealth?: Array<GeneralHealth> | null;
    womenSpecificHealth?: Array<WomenSpecific> | null;
    allergies?: Array<Allergy> | null;
    additionalAllergyNotes?: string | null;
    currentMedicationNotes?: string | null;
    otherConditionsChecked?: boolean;
};

