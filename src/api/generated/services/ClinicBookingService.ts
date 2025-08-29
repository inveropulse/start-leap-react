/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AppointmentStatus } from '../models/AppointmentStatus';
import type { ClinicBookingFilter } from '../models/ClinicBookingFilter';
import type { ClinicSedationBookingConfirmationDtoPaginationResponseResponse } from '../models/ClinicSedationBookingConfirmationDtoPaginationResponseResponse';
import type { ClinicSedationBookingConfirmationDtoResponse } from '../models/ClinicSedationBookingConfirmationDtoResponse';
import type { ClinicSedationBookingDtoResponse } from '../models/ClinicSedationBookingDtoResponse';
import type { DeleteClinicSedationBookingAttachementCommand } from '../models/DeleteClinicSedationBookingAttachementCommand';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ClinicBookingService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @param searchText
     * @param clinicBookingFilter
     * @param fromDate
     * @param toDate
     * @param ignorePortalFilters
     * @param pageNo
     * @param pageSize
     * @returns ClinicSedationBookingConfirmationDtoPaginationResponseResponse Success
     * @throws ApiError
     */
    public getApiClinicBooking(
        searchText?: string,
        clinicBookingFilter?: ClinicBookingFilter,
        fromDate?: string,
        toDate?: string,
        ignorePortalFilters?: boolean,
        pageNo?: number,
        pageSize?: number,
    ): CancelablePromise<ClinicSedationBookingConfirmationDtoPaginationResponseResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/ClinicBooking',
            query: {
                'SearchText': searchText,
                'ClinicBookingFilter': clinicBookingFilter,
                'FromDate': fromDate,
                'ToDate': toDate,
                'IgnorePortalFilters': ignorePortalFilters,
                'PageNo': pageNo,
                'PageSize': pageSize,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Not Found`,
                500: `Server Error`,
            },
        });
    }
    /**
     * @param id
     * @returns ClinicSedationBookingConfirmationDtoResponse Success
     * @throws ApiError
     */
    public getApiClinicBooking1(
        id: string,
    ): CancelablePromise<ClinicSedationBookingConfirmationDtoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/ClinicBooking/{Id}',
            path: {
                'Id': id,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Not Found`,
                500: `Server Error`,
            },
        });
    }
    /**
     * @param formData
     * @returns ClinicSedationBookingDtoResponse Success
     * @throws ApiError
     */
    public postApiClinicBookingCreateClinicSedationBooking(
        formData?: {
            PatientId?: string;
            ClinicId?: string;
            TreatingDoctor?: string;
            AppointmentId?: string;
            Notes?: string;
            'ClinicForms.FormFiles'?: Array<Blob>;
        },
    ): CancelablePromise<ClinicSedationBookingDtoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/ClinicBooking/CreateClinicSedationBooking',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Not Found`,
                500: `Server Error`,
            },
        });
    }
    /**
     * @param formData
     * @returns ClinicSedationBookingDtoResponse Success
     * @throws ApiError
     */
    public putApiClinicBookingUpdateClinicSedationBooking(
        formData?: {
            Id?: string;
            PatientId?: string;
            ClinicId?: string;
            TreatingDoctor?: string;
            AppointmentId?: string;
            Notes?: string;
            Status?: AppointmentStatus;
            'ClinicForms.FormFiles'?: Array<Blob>;
        },
    ): CancelablePromise<ClinicSedationBookingDtoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/ClinicBooking/UpdateClinicSedationBooking',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Not Found`,
                500: `Server Error`,
            },
        });
    }
    /**
     * @param id
     * @returns ClinicSedationBookingDtoResponse Success
     * @throws ApiError
     */
    public putApiClinicBookingCancelClinicSedationBooking(
        id: string,
    ): CancelablePromise<ClinicSedationBookingDtoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/ClinicBooking/CancelClinicSedationBooking/{Id}',
            path: {
                'Id': id,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Not Found`,
                500: `Server Error`,
            },
        });
    }
    /**
     * @param requestBody
     * @returns ClinicSedationBookingDtoResponse Success
     * @throws ApiError
     */
    public putApiClinicBookingDeleteClinicSedationBookingAttachement(
        requestBody?: DeleteClinicSedationBookingAttachementCommand,
    ): CancelablePromise<ClinicSedationBookingDtoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/ClinicBooking/DeleteClinicSedationBookingAttachement',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Not Found`,
                500: `Server Error`,
            },
        });
    }
}
