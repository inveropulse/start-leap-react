/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DiaryAppointmentDto } from './DiaryAppointmentDto';
import type { DiaryAvailabilityDto } from './DiaryAvailabilityDto';
export type SedationistDiaryEventsDto = {
    sedationistId?: string;
    sedationistName?: string | null;
    diaryAvailabilityEntries?: Array<DiaryAvailabilityDto> | null;
    diaryAppointmentEntries?: Array<DiaryAppointmentDto> | null;
};

