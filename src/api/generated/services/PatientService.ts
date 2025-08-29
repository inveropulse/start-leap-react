/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatePatientCommand } from '../models/CreatePatientCommand';
import type { LinkedNotLinkedSedationRecords } from '../models/LinkedNotLinkedSedationRecords';
import type { PatientDtoPaginationResponseResponse } from '../models/PatientDtoPaginationResponseResponse';
import type { PatientDtoResponse } from '../models/PatientDtoResponse';
import type { SedationAttachmentDtoPaginationResponseResponse } from '../models/SedationAttachmentDtoPaginationResponseResponse';
import type { SedationRecordDtoResponse } from '../models/SedationRecordDtoResponse';
import type { UpdatePatientCommand } from '../models/UpdatePatientCommand';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class PatientService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @param searchText
     * @param pageNo
     * @param pageSize
     * @returns PatientDtoPaginationResponseResponse Success
     * @throws ApiError
     */
    public getApiPatientPatients(
        searchText?: string,
        pageNo?: number,
        pageSize?: number,
    ): CancelablePromise<PatientDtoPaginationResponseResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Patient/Patients',
            query: {
                'SearchText': searchText,
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
     * @returns PatientDtoResponse Success
     * @throws ApiError
     */
    public getApiPatientPatientById(
        id: string,
    ): CancelablePromise<PatientDtoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Patient/PatientById/{Id}',
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
     * @returns SedationRecordDtoResponse Success
     * @throws ApiError
     */
    public getApiPatientPatientHistoricSedationRecords(
        patientId: string,
    ): CancelablePromise<SedationRecordDtoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Patient/PatientHistoricSedationRecords/{PatientId}',
            path: {
                'PatientId': patientId,
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
     * @param start
     * @param end
     * @param linkedNotLinkedSedationRecordType
     * @param pageNo
     * @param pageSize
     * @returns SedationAttachmentDtoPaginationResponseResponse Success
     * @throws ApiError
     */
    public getApiPatientPatientNewSedationRecords(
        patientId: string,
        start?: string,
        end?: string,
        linkedNotLinkedSedationRecordType?: LinkedNotLinkedSedationRecords,
        pageNo?: number,
        pageSize?: number,
    ): CancelablePromise<SedationAttachmentDtoPaginationResponseResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Patient/PatientNewSedationRecords/{PatientId}',
            path: {
                'PatientId': patientId,
            },
            query: {
                'Start': start,
                'End': end,
                'linkedNotLinkedSedationRecordType': linkedNotLinkedSedationRecordType,
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
     * @returns PatientDtoResponse Success
     * @throws ApiError
     */
    public postApiPatientCreatePatient(
        requestBody?: CreatePatientCommand,
    ): CancelablePromise<PatientDtoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/Patient/CreatePatient',
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
     * @returns PatientDtoResponse Success
     * @throws ApiError
     */
    public putApiPatientUpdatePatient(
        requestBody?: UpdatePatientCommand,
    ): CancelablePromise<PatientDtoResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/Patient/UpdatePatient',
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
     * @param reason
     * @param hasSynced
     * @returns PatientDtoResponse Success
     * @throws ApiError
     */
    public deleteApiPatientDeletePatient(
        id: string,
        reason?: string,
        hasSynced?: boolean,
    ): CancelablePromise<PatientDtoResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/Patient/DeletePatient/{Id}',
            path: {
                'Id': id,
            },
            query: {
                'Reason': reason,
                'HasSynced': hasSynced,
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
