/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DiaryAppointmentDto } from './DiaryAppointmentDto';
import type { DiaryAppointmentWorkflowDto } from './DiaryAppointmentWorkflowDto';
export type SedationistDiaryAppointmentDetailDto = {
    sedationistId?: string;
    appointmentId?: string;
    appointment?: DiaryAppointmentDto;
    appointmentWorkflows?: Array<DiaryAppointmentWorkflowDto> | null;
};

