/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AppointmentCountSummaryDtoResponse } from '../models/AppointmentCountSummaryDtoResponse';
import type { AppointmentFilter } from '../models/AppointmentFilter';
import type { AppointmentStatusSummaryDtoIEnumerableResponse } from '../models/AppointmentStatusSummaryDtoIEnumerableResponse';
import type { AverageCancelledRevenueByAppointmentDtoResponse } from '../models/AverageCancelledRevenueByAppointmentDtoResponse';
import type { AverageRevenueByAppointmentDtoResponse } from '../models/AverageRevenueByAppointmentDtoResponse';
import type { AverageRevenueByClinicSummaryDtoResponse } from '../models/AverageRevenueByClinicSummaryDtoResponse';
import type { BookingSummaryByUserDtoIEnumerableResponse } from '../models/BookingSummaryByUserDtoIEnumerableResponse';
import type { ClinicSummaryDtoIEnumerableResponse } from '../models/ClinicSummaryDtoIEnumerableResponse';
import type { ExportType } from '../models/ExportType';
import type { PatientSummaryDtoIEnumerableResponse } from '../models/PatientSummaryDtoIEnumerableResponse';
import type { PaymentStatusSummaryDtoIEnumerableResponse } from '../models/PaymentStatusSummaryDtoIEnumerableResponse';
import type { PaymentTimeSummaryDtoIEnumerableResponse } from '../models/PaymentTimeSummaryDtoIEnumerableResponse';
import type { RevenueSummaryDtoResponse } from '../models/RevenueSummaryDtoResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ReportService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @param count
     * @param fromDate
     * @param toDate
     * @returns ClinicSummaryDtoIEnumerableResponse Success
     * @throws ApiError
     */
    public getApiReportClinicLeaderboard(
        count?: number,
        fromDate?: string,
        toDate?: string,
    ): CancelablePromise<ClinicSummaryDtoIEnumerableResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Report/ClinicLeaderboard',
            query: {
                'Count': count,
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
     * @param count
     * @param fromDate
     * @param toDate
     * @returns PatientSummaryDtoIEnumerableResponse Success
     * @throws ApiError
     */
    public getApiReportPatientLeaderboard(
        count?: number,
        fromDate?: string,
        toDate?: string,
    ): CancelablePromise<PatientSummaryDtoIEnumerableResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Report/PatientLeaderboard',
            query: {
                'Count': count,
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
     * @param timeScale
     * @param fromDate
     * @param toDate
     * @param count
     * @returns BookingSummaryByUserDtoIEnumerableResponse Success
     * @throws ApiError
     */
    public getApiReportBookingTeamLeaderboard(
        timeScale?: string,
        fromDate?: string,
        toDate?: string,
        count?: number,
    ): CancelablePromise<BookingSummaryByUserDtoIEnumerableResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Report/BookingTeamLeaderboard',
            query: {
                'TimeScale': timeScale,
                'FromDate': fromDate,
                'ToDate': toDate,
                'Count': count,
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
     * @param fromDate
     * @param toDate
     * @returns AppointmentStatusSummaryDtoIEnumerableResponse Success
     * @throws ApiError
     */
    public getApiReportAppointmentBreakdownByStatus(
        fromDate?: string,
        toDate?: string,
    ): CancelablePromise<AppointmentStatusSummaryDtoIEnumerableResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Report/AppointmentBreakdownByStatus',
            query: {
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
     * @param fromDate
     * @param toDate
     * @returns PaymentStatusSummaryDtoIEnumerableResponse Success
     * @throws ApiError
     */
    public getApiReportPaymentStatusBreakdown(
        fromDate?: string,
        toDate?: string,
    ): CancelablePromise<PaymentStatusSummaryDtoIEnumerableResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Report/PaymentStatusBreakdown',
            query: {
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
     * @param timeScale
     * @param fromDate
     * @param toDate
     * @returns PaymentTimeSummaryDtoIEnumerableResponse Success
     * @throws ApiError
     */
    public getApiReportRevenueChartData(
        timeScale?: string,
        fromDate?: string,
        toDate?: string,
    ): CancelablePromise<PaymentTimeSummaryDtoIEnumerableResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Report/RevenueChartData',
            query: {
                'TimeScale': timeScale,
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
     * @param timeScale
     * @param fromDate
     * @param toDate
     * @returns RevenueSummaryDtoResponse Success
     * @throws ApiError
     */
    public getApiReportTotalRevenue(
        timeScale?: string,
        fromDate?: string,
        toDate?: string,
    ): CancelablePromise<RevenueSummaryDtoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Report/TotalRevenue',
            query: {
                'TimeScale': timeScale,
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
     * @param timeScale
     * @param fromDate
     * @param toDate
     * @returns AppointmentCountSummaryDtoResponse Success
     * @throws ApiError
     */
    public getApiReportTotalAppointments(
        timeScale?: string,
        fromDate?: string,
        toDate?: string,
    ): CancelablePromise<AppointmentCountSummaryDtoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Report/TotalAppointments',
            query: {
                'TimeScale': timeScale,
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
     * @param timeScale
     * @param fromDate
     * @param toDate
     * @returns AverageRevenueByClinicSummaryDtoResponse Success
     * @throws ApiError
     */
    public getApiReportAverageRevenueByClinic(
        timeScale?: string,
        fromDate?: string,
        toDate?: string,
    ): CancelablePromise<AverageRevenueByClinicSummaryDtoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Report/AverageRevenueByClinic',
            query: {
                'TimeScale': timeScale,
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
     * @param timeScale
     * @param fromDate
     * @param toDate
     * @returns AverageRevenueByAppointmentDtoResponse Success
     * @throws ApiError
     */
    public getApiReportAverageRevenueByAppointment(
        timeScale?: string,
        fromDate?: string,
        toDate?: string,
    ): CancelablePromise<AverageRevenueByAppointmentDtoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Report/AverageRevenueByAppointment',
            query: {
                'TimeScale': timeScale,
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
     * @param timeScale
     * @param fromDate
     * @param toDate
     * @returns AverageCancelledRevenueByAppointmentDtoResponse Success
     * @throws ApiError
     */
    public getApiReportAverageCancelledRevenueByAppointment(
        timeScale?: string,
        fromDate?: string,
        toDate?: string,
    ): CancelablePromise<AverageCancelledRevenueByAppointmentDtoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Report/AverageCancelledRevenueByAppointment',
            query: {
                'TimeScale': timeScale,
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
     * @param exportType
     * @param searchText
     * @param appointmentFilter
     * @param fromDate
     * @param toDate
     * @param patientId
     * @param ignorePortalSpecificFilters
     * @returns binary Success
     * @throws ApiError
     */
    public getApiReportExportDiaryAppointments(
        exportType?: ExportType,
        searchText?: string,
        appointmentFilter?: AppointmentFilter,
        fromDate?: string,
        toDate?: string,
        patientId?: string,
        ignorePortalSpecificFilters?: boolean,
    ): CancelablePromise<Blob> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Report/ExportDiaryAppointments',
            query: {
                'ExportType': exportType,
                'SearchText': searchText,
                'AppointmentFilter': appointmentFilter,
                'FromDate': fromDate,
                'ToDate': toDate,
                'PatientId': patientId,
                'IgnorePortalSpecificFilters': ignorePortalSpecificFilters,
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
     * @param exportType
     * @returns binary Success
     * @throws ApiError
     */
    public getApiReportExportClinics(
        searchText?: string,
        exportType?: ExportType,
    ): CancelablePromise<Blob> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Report/ExportClinics',
            query: {
                'SearchText': searchText,
                'ExportType': exportType,
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
