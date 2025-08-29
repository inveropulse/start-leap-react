/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanResponse } from '../models/BooleanResponse';
import type { CreateOrUpdateDrugsAppliedCommand } from '../models/CreateOrUpdateDrugsAppliedCommand';
import type { DeleteDrugsAppliedCommand } from '../models/DeleteDrugsAppliedCommand';
import type { DrugsAppliedDtoResponse } from '../models/DrugsAppliedDtoResponse';
import type { DrugSedationDetailDtoResponse } from '../models/DrugSedationDetailDtoResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class DrugsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @param sedationDetailId
     * @returns DrugSedationDetailDtoResponse Success
     * @throws ApiError
     */
    public getApiDrugsAllDrugsApplied(
        sedationDetailId: string,
    ): CancelablePromise<DrugSedationDetailDtoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Drugs/AllDrugsApplied/{SedationDetailId}',
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
     * @returns DrugsAppliedDtoResponse Success
     * @throws ApiError
     */
    public getApiDrugsDrugsAppliedById(
        id: string,
    ): CancelablePromise<DrugsAppliedDtoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Drugs/DrugsAppliedById/{Id}',
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
    public postApiDrugsCreateOrUpdateDrugsApplied(
        requestBody?: CreateOrUpdateDrugsAppliedCommand,
    ): CancelablePromise<DrugSedationDetailDtoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/Drugs/CreateOrUpdateDrugsApplied',
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
    public deleteApiDrugsDeleteDrugsApplied(
        requestBody?: DeleteDrugsAppliedCommand,
    ): CancelablePromise<BooleanResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/Drugs/DeleteDrugsApplied',
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
