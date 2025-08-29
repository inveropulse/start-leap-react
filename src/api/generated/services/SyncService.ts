/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateMaxSyncAttemptCommand } from '../models/CreateMaxSyncAttemptCommand';
import type { MaxAttemptDtoResponse } from '../models/MaxAttemptDtoResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class SyncService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @param requestId
     * @returns any Success
     * @throws ApiError
     */
    public getApiSync(
        requestId: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Sync/{requestId}',
            path: {
                'requestId': requestId,
            },
        });
    }
    /**
     * @param requestId
     * @param hash
     * @returns any Success
     * @throws ApiError
     */
    public getApiSyncPatientBySyncId(
        requestId: string,
        hash?: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Sync/PatientBySyncId/{requestId}',
            path: {
                'requestId': requestId,
            },
            query: {
                'hash': hash,
            },
        });
    }
    /**
     * @param requestId
     * @returns MaxAttemptDtoResponse Success
     * @throws ApiError
     */
    public getApiSyncMaxSyncAttempts(
        requestId: string,
    ): CancelablePromise<MaxAttemptDtoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Sync/MaxSyncAttempts/{requestId}',
            path: {
                'requestId': requestId,
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
     * @returns MaxAttemptDtoResponse Success
     * @throws ApiError
     */
    public postApiSyncAddMaxSyncAttempts(
        requestBody?: CreateMaxSyncAttemptCommand,
    ): CancelablePromise<MaxAttemptDtoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/Sync/AddMaxSyncAttempts',
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
