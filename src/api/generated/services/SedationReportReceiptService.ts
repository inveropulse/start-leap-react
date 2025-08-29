/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanResponse } from '../models/BooleanResponse';
import type { SedationReportReceiptDto } from '../models/SedationReportReceiptDto';
import type { SedationReportReceiptDtoPaginationResponseResponse } from '../models/SedationReportReceiptDtoPaginationResponseResponse';
import type { SedationReportReceiptDtoResponse } from '../models/SedationReportReceiptDtoResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class SedationReportReceiptService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @param sedationDetailId
     * @returns SedationReportReceiptDtoResponse Success
     * @throws ApiError
     */
    public getApiSedationReportReceiptSedationReportReceipt(
        sedationDetailId: string,
    ): CancelablePromise<SedationReportReceiptDtoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/SedationReportReceipt/SedationReportReceipt/{SedationDetailId}',
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
     * @param pageNo
     * @param pageSize
     * @returns SedationReportReceiptDtoPaginationResponseResponse Success
     * @throws ApiError
     */
    public getApiSedationReportReceiptSedationReportReceipts(
        pageNo?: number,
        pageSize?: number,
    ): CancelablePromise<SedationReportReceiptDtoPaginationResponseResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/SedationReportReceipt/SedationReportReceipts',
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
     * @returns SedationReportReceiptDtoResponse Success
     * @throws ApiError
     */
    public postApiSedationReportReceiptCreateSedationReportReceipt(
        requestBody?: SedationReportReceiptDto,
    ): CancelablePromise<SedationReportReceiptDtoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/SedationReportReceipt/CreateSedationReportReceipt',
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
     * @returns SedationReportReceiptDtoResponse Success
     * @throws ApiError
     */
    public putApiSedationReportReceiptUpdateSedationReportReceipt(
        requestBody?: SedationReportReceiptDto,
    ): CancelablePromise<SedationReportReceiptDtoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/SedationReportReceipt/UpdateSedationReportReceipt',
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
    public deleteApiSedationReportReceiptDeleteSedationReportReceipt(
        id: string,
    ): CancelablePromise<BooleanResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/SedationReportReceipt/DeleteSedationReportReceipt/{Id}',
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
