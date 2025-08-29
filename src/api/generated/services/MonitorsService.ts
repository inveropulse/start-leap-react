/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanResponse } from '../models/BooleanResponse';
import type { CreateOrUpdateMonitorsAppliedCommand } from '../models/CreateOrUpdateMonitorsAppliedCommand';
import type { DeleteMonitorsAppliedCommand } from '../models/DeleteMonitorsAppliedCommand';
import type { DrugSedationDetailDtoResponse } from '../models/DrugSedationDetailDtoResponse';
import type { MonitorsAppliedDtoIEnumerableResponse } from '../models/MonitorsAppliedDtoIEnumerableResponse';
import type { MonitorsAppliedDtoResponse } from '../models/MonitorsAppliedDtoResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class MonitorsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @param sedationDetailId
     * @returns MonitorsAppliedDtoIEnumerableResponse Success
     * @throws ApiError
     */
    public getApiMonitorsAllMonitorsApplied(
        sedationDetailId: string,
    ): CancelablePromise<MonitorsAppliedDtoIEnumerableResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Monitors/AllMonitorsApplied/{SedationDetailId}',
            path: {
                'SedationDetailId': sedationDetailId,
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
     * @returns MonitorsAppliedDtoResponse Success
     * @throws ApiError
     */
    public getApiMonitorsMonitorsAppliedById(
        id: string,
    ): CancelablePromise<MonitorsAppliedDtoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Monitors/MonitorsAppliedById/{Id}',
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
     * @returns DrugSedationDetailDtoResponse Success
     * @throws ApiError
     */
    public postApiMonitorsCreateOrUpdateMonitorsApplied(
        requestBody?: CreateOrUpdateMonitorsAppliedCommand,
    ): CancelablePromise<DrugSedationDetailDtoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/Monitors/CreateOrUpdateMonitorsApplied',
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
     * @returns BooleanResponse Success
     * @throws ApiError
     */
    public deleteApiMonitorsDeleteMonitorsApplied(
        requestBody?: DeleteMonitorsAppliedCommand,
    ): CancelablePromise<BooleanResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/Monitors/DeleteMonitorsApplied',
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
