/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClinicDto } from './ClinicDto';
import type { DoctorDto } from './DoctorDto';
import type { UserDto } from './UserDto';
export type ClinicDetailDto = {
    users?: Array<UserDto> | null;
    clinic?: ClinicDto;
    doctors?: Array<DoctorDto> | null;
};

