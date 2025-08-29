/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JwtToken } from './JwtToken';
import type { RefreshToken } from './RefreshToken';
import type { UserProfile } from './UserProfile';
export type LoginResponseDto = {
    token?: JwtToken;
    refreshToken?: RefreshToken;
    expiration?: number;
    userProfile?: UserProfile;
};

