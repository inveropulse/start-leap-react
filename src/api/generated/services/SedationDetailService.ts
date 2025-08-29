/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanResponse } from '../models/BooleanResponse';
import type { SedationDetailDto } from '../models/SedationDetailDto';
import type { SedationDetailDtoPaginationResponseResponse } from '../models/SedationDetailDtoPaginationResponseResponse';
import type { SedationDetailDtoResponse } from '../models/SedationDetailDtoResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class SedationDetailService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @param id
     * @returns SedationDetailDtoResponse Success
     * @throws ApiError
     */
    public getApiSedationDetail(
        id: string,
    ): CancelablePromise<SedationDetailDtoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/SedationDetail/{Id}',
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
     * @param patientId
     * @param pageNo
     * @param pageSize
     * @returns SedationDetailDtoPaginationResponseResponse Success
     * @throws ApiError
     */
    public getApiSedationDetailSedationDetails(
        patientId: string,
        pageNo?: number,
        pageSize?: number,
    ): CancelablePromise<SedationDetailDtoPaginationResponseResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/SedationDetail/SedationDetails/{PatientId}',
            path: {
                'PatientId': patientId,
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
     * @returns SedationDetailDtoResponse Success
     * @throws ApiError
     */
    public postApiSedationDetailCreateSedationDetail(
        requestBody?: SedationDetailDto,
    ): CancelablePromise<SedationDetailDtoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/SedationDetail/CreateSedationDetail',
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
     * @returns SedationDetailDtoResponse Success
     * @throws ApiError
     */
    public putApiSedationDetailUpdateSedationDetail(
        requestBody?: SedationDetailDto,
    ): CancelablePromise<SedationDetailDtoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/SedationDetail/UpdateSedationDetail',
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
    public deleteApiSedationDetailDeleteSedationDetail(
        id: string,
    ): CancelablePromise<BooleanResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/SedationDetail/DeleteSedationDetail/{Id}',
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
