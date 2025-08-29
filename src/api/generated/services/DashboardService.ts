/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InternalDashboardCountsDtoApiResponse } from '../models/InternalDashboardCountsDtoApiResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class DashboardService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @returns InternalDashboardCountsDtoApiResponse Success
     * @throws ApiError
     */
    public getApiDashboardInternalDashboardCounts(): CancelablePromise<InternalDashboardCountsDtoApiResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Dashboard/InternalDashboardCounts',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Not Found`,
                500: `Server Error`,
            },
        });
    }
}
