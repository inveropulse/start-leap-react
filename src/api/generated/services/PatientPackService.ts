/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PatientPackDtoPaginationResponseResponse } from '../models/PatientPackDtoPaginationResponseResponse';
import type { PatientPackDtoResponse } from '../models/PatientPackDtoResponse';
import type { SaveProgressCommand } from '../models/SaveProgressCommand';
import type { SubmitPatientPackCommand } from '../models/SubmitPatientPackCommand';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PatientPackService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @param appointmentId
     * @returns PatientPackDtoResponse Success
     * @throws ApiError
     */
    public getApiPatientPack(
        appointmentId: string,
    ): CancelablePromise<PatientPackDtoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/PatientPack/{AppointmentId}',
            path: {
                'AppointmentId': appointmentId,
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
     * @returns PatientPackDtoResponse Success
     * @throws ApiError
     */
    public postApiPatientPackProgress(
        requestBody?: SaveProgressCommand,
    ): CancelablePromise<PatientPackDtoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/PatientPack/Progress',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }
    /**
     * @param requestBody
     * @returns PatientPackDtoResponse Success
     * @throws ApiError
     */
    public postApiPatientPackSubmit(
        requestBody?: SubmitPatientPackCommand,
    ): CancelablePromise<PatientPackDtoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/PatientPack/Submit',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                500: `Server Error`,
            },
        });
    }
    /**
     * @param formData
     * @returns PatientPackDtoPaginationResponseResponse Success
     * @throws ApiError
     */
    public postApiPatientPackAddPatientPack(
        formData?: {
            PatientId?: string;
            AppointmentId?: string;
            Files?: Array<Blob>;
        },
    ): CancelablePromise<PatientPackDtoPaginationResponseResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/PatientPack/AddPatientPack',
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
     * @returns PatientPackDtoPaginationResponseResponse Success
     * @throws ApiError
     */
    public postApiPatientPackUpdatePatientPack(
        formData?: {
            Id?: string;
            Files?: Array<Blob>;
        },
    ): CancelablePromise<PatientPackDtoPaginationResponseResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/PatientPack/UpdatePatientPack',
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
     * @param appointmentId
     * @param attachmentId
     * @returns PatientPackDtoPaginationResponseResponse Success
     * @throws ApiError
     */
    public deleteApiPatientPackDeletePatientPack(
        appointmentId: string,
        attachmentId?: string,
    ): CancelablePromise<PatientPackDtoPaginationResponseResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/PatientPack/DeletePatientPack/{AppointmentId}',
            path: {
                'AppointmentId': appointmentId,
            },
            query: {
                'AttachmentId': attachmentId,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Not Found`,
                500: `Server Error`,
            },
        });
    }
}
