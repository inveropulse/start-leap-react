/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HealthDtoResponse } from '../models/HealthDtoResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class HealthService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @returns string Success
     * @throws ApiError
     */
    public getApiHealth(): CancelablePromise<string> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Health',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Not Found`,
                500: `Server Error`,
            },
        });
    }
    /**
     * @returns HealthDtoResponse Success
     * @throws ApiError
     */
    public getApiHealthVersionInformation(): CancelablePromise<HealthDtoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Health/VersionInformation',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Not Found`,
                500: `Server Error`,
            },
        });
    }
}
