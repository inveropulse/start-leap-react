/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ClinicDetailDto } from '../models/ClinicDetailDto';
import type { ClinicDetailDtoResponse } from '../models/ClinicDetailDtoResponse';
import type { ClinicDto } from '../models/ClinicDto';
import type { ClinicDtoPaginationResponseResponse } from '../models/ClinicDtoPaginationResponseResponse';
import type { CreateClinicCommand } from '../models/CreateClinicCommand';
import type { UpdateClinicCommand } from '../models/UpdateClinicCommand';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ClinicsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @param searchText
     * @param includeAll
     * @param pageNo
     * @param pageSize
     * @returns ClinicDtoPaginationResponseResponse Success
     * @throws ApiError
     */
    public getApiClinicsClinics(
        searchText?: string,
        includeAll?: boolean,
        pageNo?: number,
        pageSize?: number,
    ): CancelablePromise<ClinicDtoPaginationResponseResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Clinics/Clinics',
            query: {
                'SearchText': searchText,
                'IncludeAll': includeAll,
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
     * @returns ClinicDetailDtoResponse Success
     * @throws ApiError
     */
    public getApiClinicsClinicById(
        id: string,
    ): CancelablePromise<ClinicDetailDtoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Clinics/ClinicById/{Id}',
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
     * @returns ClinicDetailDto Success
     * @throws ApiError
     */
    public postApiClinicsCreateClinic(
        requestBody?: CreateClinicCommand,
    ): CancelablePromise<ClinicDetailDto> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/Clinics/CreateClinic',
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
    /**
     * @param requestBody
     * @returns ClinicDetailDtoResponse Success
     * @throws ApiError
     */
    public putApiClinicsUpdateClinic(
        requestBody?: UpdateClinicCommand,
    ): CancelablePromise<ClinicDetailDtoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/Clinics/UpdateClinic',
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
    /**
     * @param id
     * @returns ClinicDto Success
     * @throws ApiError
     */
    public deleteApiClinicsDeleteClinic(
        id: string,
    ): CancelablePromise<ClinicDto> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/Clinics/DeleteClinic/{Id}',
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
}
