/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateSedationistCommand } from '../models/CreateSedationistCommand';
import type { SedationistDtoPaginationResponseResponse } from '../models/SedationistDtoPaginationResponseResponse';
import type { SedationistDtoResponse } from '../models/SedationistDtoResponse';
import type { UpdateSedationistCommand } from '../models/UpdateSedationistCommand';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class SedationistService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @param searchText
     * @param includeAll
     * @param pageNo
     * @param pageSize
     * @returns SedationistDtoPaginationResponseResponse Success
     * @throws ApiError
     */
    public getApiSedationistSedationists(
        searchText?: string,
        includeAll?: boolean,
        pageNo?: number,
        pageSize?: number,
    ): CancelablePromise<SedationistDtoPaginationResponseResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Sedationist/Sedationists',
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
     * @returns SedationistDtoResponse Success
     * @throws ApiError
     */
    public getApiSedationistSedationistById(
        id: string,
    ): CancelablePromise<SedationistDtoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Sedationist/SedationistById/{Id}',
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
     * @returns SedationistDtoResponse Success
     * @throws ApiError
     */
    public postApiSedationistCreateSedationist(
        requestBody?: CreateSedationistCommand,
    ): CancelablePromise<SedationistDtoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/Sedationist/CreateSedationist',
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
     * @returns SedationistDtoResponse Success
     * @throws ApiError
     */
    public putApiSedationistUpdateSedationist(
        requestBody?: UpdateSedationistCommand,
    ): CancelablePromise<SedationistDtoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/Sedationist/UpdateSedationist',
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
     * @returns SedationistDtoResponse Success
     * @throws ApiError
     */
    public deleteApiSedationistDeleteSedationist(
        id: string,
    ): CancelablePromise<SedationistDtoResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/Sedationist/DeleteSedationist/{Id}',
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
