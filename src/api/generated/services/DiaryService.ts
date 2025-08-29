/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddDiaryAppointmentSedationRecordAttachmentsResponseResponse } from '../models/AddDiaryAppointmentSedationRecordAttachmentsResponseResponse';
import type { AdditionalInfo } from '../models/AdditionalInfo';
import type { AppointmentFilter } from '../models/AppointmentFilter';
import type { AppointmentPaymentDetailsDtoApiResponse } from '../models/AppointmentPaymentDetailsDtoApiResponse';
import type { CreateDiaryAppointmentCommand } from '../models/CreateDiaryAppointmentCommand';
import type { CreateDiaryAvailabilityCommand } from '../models/CreateDiaryAvailabilityCommand';
import type { DeleteDiaryAppointmentSedationRecordAttachmentsCommand } from '../models/DeleteDiaryAppointmentSedationRecordAttachmentsCommand';
import type { DeleteDiaryAppointmentSedationRecordAttachmentsResponseResponse } from '../models/DeleteDiaryAppointmentSedationRecordAttachmentsResponseResponse';
import type { DiaryAppointmentAttachmentSummaryDtoResponse } from '../models/DiaryAppointmentAttachmentSummaryDtoResponse';
import type { DiaryAppointmentDtoApiResponse } from '../models/DiaryAppointmentDtoApiResponse';
import type { DiaryAppointmentDtoPaginationResponseResponse } from '../models/DiaryAppointmentDtoPaginationResponseResponse';
import type { DiaryAvailabilityDtoApiResponse } from '../models/DiaryAvailabilityDtoApiResponse';
import type { LinkSedationRecordResponseApiResponse } from '../models/LinkSedationRecordResponseApiResponse';
import type { LinkSedationRecordToAppointmentRequest } from '../models/LinkSedationRecordToAppointmentRequest';
import type { SedationistDiaryAppointmentDetailDtoApiResponse } from '../models/SedationistDiaryAppointmentDetailDtoApiResponse';
import type { SedationistDiaryAvailabilityDetailDtoApiResponse } from '../models/SedationistDiaryAvailabilityDetailDtoApiResponse';
import type { SedationistDiaryEventsDtoIEnumerableApiResponse } from '../models/SedationistDiaryEventsDtoIEnumerableApiResponse';
import type { UnLinkSedationRecordToAppointmentCommand } from '../models/UnLinkSedationRecordToAppointmentCommand';
import type { UpdateAppointmentPaymentDetailsCommand } from '../models/UpdateAppointmentPaymentDetailsCommand';
import type { UpdateDiaryAppointmentCommand } from '../models/UpdateDiaryAppointmentCommand';
import type { UpdateDiaryAvailabilityCommand } from '../models/UpdateDiaryAvailabilityCommand';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class DiaryService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @param requestBody
     * @returns DiaryAppointmentDtoApiResponse Success
     * @throws ApiError
     */
    public postApiDiaryCreateDiaryAppointment(
        requestBody?: CreateDiaryAppointmentCommand,
    ): CancelablePromise<DiaryAppointmentDtoApiResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/Diary/CreateDiaryAppointment',
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
     * @returns DiaryAppointmentDtoApiResponse Success
     * @throws ApiError
     */
    public putApiDiaryUpdateDiaryAppointment(
        requestBody?: UpdateDiaryAppointmentCommand,
    ): CancelablePromise<DiaryAppointmentDtoApiResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/Diary/UpdateDiaryAppointment',
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
     * @param requestBody
     * @returns DiaryAppointmentDtoApiResponse Success
     * @throws ApiError
     */
    public putApiDiaryCancelDiaryAppointment(
        id: string,
        requestBody?: AdditionalInfo,
    ): CancelablePromise<DiaryAppointmentDtoApiResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/Diary/CancelDiaryAppointment/{Id}',
            path: {
                'Id': id,
            },
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
     * @returns LinkSedationRecordResponseApiResponse Success
     * @throws ApiError
     */
    public putApiDiaryLinkSedationRecordToDiaryAppointment(
        requestBody?: LinkSedationRecordToAppointmentRequest,
    ): CancelablePromise<LinkSedationRecordResponseApiResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/Diary/LinkSedationRecordToDiaryAppointment',
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
     * @returns LinkSedationRecordResponseApiResponse Success
     * @throws ApiError
     */
    public putApiDiaryUnLinkSedationRecordToDiaryAppointment(
        requestBody?: UnLinkSedationRecordToAppointmentCommand,
    ): CancelablePromise<LinkSedationRecordResponseApiResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/Diary/UnLinkSedationRecordToDiaryAppointment',
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
     * @returns DiaryAvailabilityDtoApiResponse Success
     * @throws ApiError
     */
    public postApiDiaryCreateDiaryAvailability(
        requestBody?: CreateDiaryAvailabilityCommand,
    ): CancelablePromise<DiaryAvailabilityDtoApiResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/Diary/CreateDiaryAvailability',
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
     * @returns DiaryAppointmentDtoApiResponse Success
     * @throws ApiError
     */
    public putApiDiaryUpdateDiaryAvailability(
        requestBody?: UpdateDiaryAvailabilityCommand,
    ): CancelablePromise<DiaryAppointmentDtoApiResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/Diary/UpdateDiaryAvailability',
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
     * @param notes
     * @returns DiaryAppointmentDtoApiResponse Success
     * @throws ApiError
     */
    public putApiDiaryCancelDiaryAvailability(
        id: string,
        notes?: string,
    ): CancelablePromise<DiaryAppointmentDtoApiResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/Diary/CancelDiaryAvailability/{Id}',
            path: {
                'Id': id,
            },
            query: {
                'Notes': notes,
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
     * @param sedationistIds
     * @param fromDate
     * @param toDate
     * @returns SedationistDiaryEventsDtoIEnumerableApiResponse Success
     * @throws ApiError
     */
    public getApiDiaryDiaryAppointments(
        sedationistIds?: Array<string>,
        fromDate?: string,
        toDate?: string,
    ): CancelablePromise<SedationistDiaryEventsDtoIEnumerableApiResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Diary/DiaryAppointments',
            query: {
                'SedationistIds': sedationistIds,
                'FromDate': fromDate,
                'ToDate': toDate,
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
     * @param appointmentId
     * @returns DiaryAppointmentAttachmentSummaryDtoResponse Success
     * @throws ApiError
     */
    public getApiDiaryDiaryAppointmentAttachments(
        appointmentId: string,
    ): CancelablePromise<DiaryAppointmentAttachmentSummaryDtoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Diary/DiaryAppointmentAttachments/{AppointmentId}',
            path: {
                'AppointmentId': appointmentId,
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
     * @returns AddDiaryAppointmentSedationRecordAttachmentsResponseResponse Success
     * @throws ApiError
     */
    public postApiDiaryAddDiaryAppointmentSedationRecordAttachments(
        formData?: {
            AppointmentId?: string;
            Files?: Array<Blob>;
        },
    ): CancelablePromise<AddDiaryAppointmentSedationRecordAttachmentsResponseResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/Diary/AddDiaryAppointmentSedationRecordAttachments',
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
     * @param requestBody
     * @returns DeleteDiaryAppointmentSedationRecordAttachmentsResponseResponse Success
     * @throws ApiError
     */
    public deleteApiDiaryDeleteDiaryAppointmentSedationRecordAttachments(
        requestBody?: DeleteDiaryAppointmentSedationRecordAttachmentsCommand,
    ): CancelablePromise<DeleteDiaryAppointmentSedationRecordAttachmentsResponseResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/Diary/DeleteDiaryAppointmentSedationRecordAttachments',
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
     * @param searchText
     * @param appointmentFilter
     * @param fromDate
     * @param toDate
     * @param patientId
     * @param ignorePortalSpecificFilters
     * @param includeAll
     * @param pageNo
     * @param pageSize
     * @returns DiaryAppointmentDtoPaginationResponseResponse Success
     * @throws ApiError
     */
    public getApiDiaryListViewAppointments(
        searchText?: string,
        appointmentFilter?: AppointmentFilter,
        fromDate?: string,
        toDate?: string,
        patientId?: string,
        ignorePortalSpecificFilters?: boolean,
        includeAll?: boolean,
        pageNo?: number,
        pageSize?: number,
    ): CancelablePromise<DiaryAppointmentDtoPaginationResponseResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Diary/ListViewAppointments',
            query: {
                'SearchText': searchText,
                'AppointmentFilter': appointmentFilter,
                'FromDate': fromDate,
                'ToDate': toDate,
                'PatientId': patientId,
                'IgnorePortalSpecificFilters': ignorePortalSpecificFilters,
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
     * @param appointmentId
     * @returns SedationistDiaryAppointmentDetailDtoApiResponse Success
     * @throws ApiError
     */
    public getApiDiaryBookingAppointmentDetail(
        appointmentId: string,
    ): CancelablePromise<SedationistDiaryAppointmentDetailDtoApiResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Diary/BookingAppointmentDetail/{AppointmentId}',
            path: {
                'AppointmentId': appointmentId,
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
     * @param availabilityId
     * @returns SedationistDiaryAvailabilityDetailDtoApiResponse Success
     * @throws ApiError
     */
    public getApiDiaryAvailabilityAppointmentDetail(
        availabilityId: string,
    ): CancelablePromise<SedationistDiaryAvailabilityDetailDtoApiResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Diary/AvailabilityAppointmentDetail/{AvailabilityId}',
            path: {
                'AvailabilityId': availabilityId,
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
     * @param appointmentId
     * @returns AppointmentPaymentDetailsDtoApiResponse Success
     * @throws ApiError
     */
    public getApiDiaryGetPaymentDetails(
        appointmentId: string,
    ): CancelablePromise<AppointmentPaymentDetailsDtoApiResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Diary/GetPaymentDetails/{AppointmentId}',
            path: {
                'AppointmentId': appointmentId,
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
     * @returns AppointmentPaymentDetailsDtoApiResponse Success
     * @throws ApiError
     */
    public putApiDiaryUpdatePaymentDetails(
        requestBody?: UpdateAppointmentPaymentDetailsCommand,
    ): CancelablePromise<AppointmentPaymentDetailsDtoApiResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/Diary/UpdatePaymentDetails',
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
