/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminUserDtoPaginationResponseResponse } from '../models/AdminUserDtoPaginationResponseResponse';
import type { AssignRolesToUserCommand } from '../models/AssignRolesToUserCommand';
import type { BooleanApiResponse } from '../models/BooleanApiResponse';
import type { BooleanResponse } from '../models/BooleanResponse';
import type { ForgotPasswordCommand } from '../models/ForgotPasswordCommand';
import type { ForgotPasswordDtoApiResponse } from '../models/ForgotPasswordDtoApiResponse';
import type { Login2FACommand } from '../models/Login2FACommand';
import type { LoginDtoApiResponse } from '../models/LoginDtoApiResponse';
import type { LoginQuery } from '../models/LoginQuery';
import type { LoginResponseDtoApiResponse } from '../models/LoginResponseDtoApiResponse';
import type { RefreshCommand } from '../models/RefreshCommand';
import type { RegisterCommand } from '../models/RegisterCommand';
import type { RegisterDtoApiResponse } from '../models/RegisterDtoApiResponse';
import type { ResetPasswordCommand } from '../models/ResetPasswordCommand';
import type { ResetPasswordDtoApiResponse } from '../models/ResetPasswordDtoApiResponse';
import type { UpdateAdminUserRequest } from '../models/UpdateAdminUserRequest';
import type { UpdateUserEmailByTypeCommand } from '../models/UpdateUserEmailByTypeCommand';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AuthService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * @param requestBody
     * @returns RegisterDtoApiResponse Created
     * @throws ApiError
     */
    public postApiAuthRegister(
        requestBody?: RegisterCommand,
    ): CancelablePromise<RegisterDtoApiResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/Auth/Register',
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
     * @param email
     * @param token
     * @returns RegisterDtoApiResponse Success
     * @throws ApiError
     */
    public getApiAuthConfirm(
        email?: string,
        token?: string,
    ): CancelablePromise<RegisterDtoApiResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Auth/Confirm',
            query: {
                'Email': email,
                'Token': token,
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
     * @returns LoginResponseDtoApiResponse Success
     * @throws ApiError
     */
    public postApiAuthLogin(
        requestBody?: LoginQuery,
    ): CancelablePromise<LoginResponseDtoApiResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/Auth/Login',
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
     * @returns LoginDtoApiResponse Success
     * @throws ApiError
     */
    public postApiAuthLogin2Fa(
        requestBody?: Login2FACommand,
    ): CancelablePromise<LoginDtoApiResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/Auth/Login2FA',
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
     * @returns LoginDtoApiResponse Success
     * @throws ApiError
     */
    public postApiAuthRefreshToken(
        requestBody?: RefreshCommand,
    ): CancelablePromise<LoginDtoApiResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/Auth/RefreshToken',
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
     * @returns ForgotPasswordDtoApiResponse Success
     * @throws ApiError
     */
    public postApiAuthForgotPassword(
        requestBody?: ForgotPasswordCommand,
    ): CancelablePromise<ForgotPasswordDtoApiResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/Auth/ForgotPassword',
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
     * @returns ResetPasswordDtoApiResponse Success
     * @throws ApiError
     */
    public postApiAuthResetPassword(
        requestBody?: ResetPasswordCommand,
    ): CancelablePromise<ResetPasswordDtoApiResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/Auth/ResetPassword',
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
     * @returns BooleanApiResponse Success
     * @throws ApiError
     */
    public postApiAuthAddRolesToUser(
        requestBody?: AssignRolesToUserCommand,
    ): CancelablePromise<BooleanApiResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/Auth/AddRolesToUser',
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
     * @returns BooleanApiResponse Success
     * @throws ApiError
     */
    public postApiAuthLogout(): CancelablePromise<BooleanApiResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/api/Auth/Logout',
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
     * @param pageNo
     * @param pageSize
     * @returns AdminUserDtoPaginationResponseResponse Success
     * @throws ApiError
     */
    public getApiAuthGetAdminUsers(
        searchText?: string,
        pageNo?: number,
        pageSize?: number,
    ): CancelablePromise<AdminUserDtoPaginationResponseResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/api/Auth/GetAdminUsers',
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
     * @param requestBody
     * @returns BooleanResponse Success
     * @throws ApiError
     */
    public putApiAuthUpdateAdminUser(
        id: string,
        requestBody?: UpdateAdminUserRequest,
    ): CancelablePromise<BooleanResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/Auth/UpdateAdminUser/{Id}',
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
     * @param id
     * @returns BooleanResponse Success
     * @throws ApiError
     */
    public deleteApiAuthDeleteAdminUser(
        id: string,
    ): CancelablePromise<BooleanResponse> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/api/Auth/DeleteAdminUser/{Id}',
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
     * @returns BooleanResponse Success
     * @throws ApiError
     */
    public putApiAuthUpdateUserEmail(
        requestBody?: UpdateUserEmailByTypeCommand,
    ): CancelablePromise<BooleanResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/api/Auth/UpdateUserEmail',
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
