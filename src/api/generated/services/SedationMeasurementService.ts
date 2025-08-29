/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanResponse } from '../models/BooleanResponse';
import type { SedationMeasurementDto } from '../models/SedationMeasurementDto';
import type { SedationMeasurementDtoPaginationResponseResponse } from '../models/SedationMeasurementDtoPaginationResponseResponse';
import type { SedationMeasurementDtoResponse } from '../models/SedationMeasurementDtoResponse';
import type { SedationMeasurementQuery } from '../models/SedationMeasurementQuery';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class SedationMeasurementService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @param id
     * @param requestBody
     * @returns SedationMeasurementDtoResponse Success
     * @throws ApiError
     */
    public getApiSedationMeasurementSedationMeasurementById(
        id: string,
        requestBody?: SedationMeasurementQuery,
    ): CancelablePromise<SedationMeasurementDtoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/SedationMeasurement/SedationMeasurementById/{Id}',
            path: {
                'Id': id,
            },
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
     * @param sedationDetailId
     * @param pageNo
     * @param pageSize
     * @returns SedationMeasurementDtoPaginationResponseResponse Success
     * @throws ApiError
     */
    public getApiSedationMeasurementSedationMeasurements(
        sedationDetailId: string,
        pageNo?: number,
        pageSize?: number,
    ): CancelablePromise<SedationMeasurementDtoPaginationResponseResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/SedationMeasurement/SedationMeasurements/{SedationDetailId}',
            path: {
                'SedationDetailId': sedationDetailId,
            },
            query: {
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
     * @param requestBody
     * @returns SedationMeasurementDtoResponse Success
     * @throws ApiError
     */
    public postApiSedationMeasurementCreateSedationMeasurement(
        requestBody?: SedationMeasurementDto,
    ): CancelablePromise<SedationMeasurementDtoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/SedationMeasurement/CreateSedationMeasurement',
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
     * @returns SedationMeasurementDtoResponse Success
     * @throws ApiError
     */
    public putApiSedationMeasurementUpdateSedationMeasurement(
        requestBody?: SedationMeasurementDto,
    ): CancelablePromise<SedationMeasurementDtoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/SedationMeasurement/UpdateSedationMeasurement',
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
     * @returns BooleanResponse Success
     * @throws ApiError
     */
    public deleteApiSedationMeasurementDeleteSedationMeasurement(
        id: string,
    ): CancelablePromise<BooleanResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/SedationMeasurement/DeleteSedationMeasurement/{Id}',
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
