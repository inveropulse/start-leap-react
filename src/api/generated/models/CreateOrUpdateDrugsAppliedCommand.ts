/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DrugEventDto } from './DrugEventDto';
import type { DrugsAppliedDto } from './DrugsAppliedDto';
import type { SedationTimelineDto } from './SedationTimelineDto';
export type CreateOrUpdateDrugsAppliedCommand = {
    sedationDetailId?: string;
    drugEventsAppliedOverTime?: Array<DrugEventDto> | null;
    drugsApplied?: Array<DrugsAppliedDto> | null;
    sedationTimeline?: SedationTimelineDto;
};

