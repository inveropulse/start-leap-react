/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Attachment } from '../models/Attachment';
import type { TemplateDtoPaginationResponseResponse } from '../models/TemplateDtoPaginationResponseResponse';
import type { TemplateDtoResponse } from '../models/TemplateDtoResponse';
import type { TemplateType } from '../models/TemplateType';
import type { TemplateVariable } from '../models/TemplateVariable';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class TemplateService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @param templateId
     * @returns TemplateDtoResponse Success
     * @throws ApiError
     */
    public getApiTemplate(
        templateId: string,
    ): CancelablePromise<TemplateDtoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Template/{TemplateId}',
            path: {
                'TemplateId': templateId,
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
     * @param templateId
     * @returns TemplateDtoPaginationResponseResponse Success
     * @throws ApiError
     */
    public deleteApiTemplate(
        templateId: string,
    ): CancelablePromise<TemplateDtoPaginationResponseResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/Template/{TemplateId}',
            path: {
                'TemplateId': templateId,
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
     * @param searchText
     * @param templateType
     * @param pageNo
     * @param pageSize
     * @returns TemplateDtoPaginationResponseResponse Success
     * @throws ApiError
     */
    public getApiTemplate1(
        searchText?: string,
        templateType?: TemplateType,
        pageNo?: number,
        pageSize?: number,
    ): CancelablePromise<TemplateDtoPaginationResponseResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Template',
            query: {
                'SearchText': searchText,
                'TemplateType': templateType,
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
     * @param formData
     * @returns TemplateDtoPaginationResponseResponse Success
     * @throws ApiError
     */
    public postApiTemplate(
        formData?: {
            Name?: string;
            Type?: TemplateType;
            'Value.Subject'?: string;
            'Value.Content'?: string;
            'Value.Attachments'?: Array<Attachment>;
            'Value.Variables'?: Array<TemplateVariable>;
            Variable?: string;
            Files?: Array<Blob>;
        },
    ): CancelablePromise<TemplateDtoPaginationResponseResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/Template',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Not Found`,
                500: `Server Error`,
            },
        });
    }
    /**
     * @param formData
     * @returns TemplateDtoPaginationResponseResponse Success
     * @throws ApiError
     */
    public putApiTemplate(
        formData?: {
            Id?: string;
            Type?: TemplateType;
            'Value.Subject'?: string;
            'Value.Content'?: string;
            'Value.Attachments'?: Array<Attachment>;
            'Value.Variables'?: Array<TemplateVariable>;
            Files?: Array<Blob>;
        },
    ): CancelablePromise<TemplateDtoPaginationResponseResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/Template',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                404: `Not Found`,
                500: `Server Error`,
            },
        });
    }
    /**
     * @param templateId
     * @param attachmentId
     * @returns TemplateDtoPaginationResponseResponse Success
     * @throws ApiError
     */
    public deleteApiTemplateDeleteAttachment(
        templateId: string,
        attachmentId?: string,
    ): CancelablePromise<TemplateDtoPaginationResponseResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/Template/DeleteAttachment/{TemplateId}',
            path: {
                'TemplateId': templateId,
            },
            query: {
                'AttachmentId': attachmentId,
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
