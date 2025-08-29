/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DiaryAvailabilityDto } from './DiaryAvailabilityDto';
import type { DiaryAvailabilityWorkflowDto } from './DiaryAvailabilityWorkflowDto';
export type SedationistDiaryAvailabilityDetailDto = {
    sedationistId?: string;
    availabilityId?: string;
    availability?: DiaryAvailabilityDto;
    availabilityWorkflows?: Array<DiaryAvailabilityWorkflowDto> | null;
};

