/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StringResponse } from '../models/StringResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class LogService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @param requestBody
     * @returns StringResponse Success
     * @throws ApiError
     */
    public postApiLogAddLog(
        requestBody?: any,
    ): CancelablePromise<StringResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/Log/AddLog',
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
