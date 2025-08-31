import { LoginDto } from "../generated";
import { useMutation } from "@tanstack/react-query";
import { useAxiosClient } from "@/shared/providers/AxiosClientProvider";

export interface RefreshTokenRequest {
  token: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token?: string;
  tokenExpires?: number;
  refresh?: string;
  refreshExpires?: number;
}

export const useRefreshTokenRequest = () => {
  const { apiClient } = useAxiosClient();

  return useMutation({
    mutationKey: ["refresh.user.access.token.request"],
    mutationFn: async (
      req: RefreshTokenRequest
    ): Promise<RefreshTokenResponse> => {
      // For now, keeping mock implementation
      // Replace this with actual API call when ready
      //     const response = await this.apiClient.auth.postApiAuthRefreshToken(req);
      //     if (!response.successful) {
      //       throw new Error("Failed to refresh token");
      //     }
      //     return createRefreshResponse(response.data);

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ...createRefreshResponse(createFakeApiRefreshResponse()),
          });
        }, 500);
      });

      // When ready to use real API, replace above with:
      // const response = await axios.post(ApiEndpoint.REFRESH, req);
      // return response.data;
    },
  });
};

export const createFakeApiRefreshResponse = (): LoginDto => {
  return {
    token: {
      token: "fake-access-token",
      tokenExpiration: new Date(Date.now() + 3600 * 1000).toISOString(),
    },
    refreshToken: {
      token: "fake-refresh-token",
      refreshTokenExpiration: new Date(
        Date.now() + 7 * 24 * 3600 * 1000
      ).toISOString(),
    },
  };
};

export const createRefreshResponse = (
  response: LoginDto
): RefreshTokenResponse => {
  return {
    token: response.token.token,
    tokenExpires: new Date(response.token.tokenExpiration).getTime(),
    refresh: response.refreshToken.token,
    refreshExpires: new Date(
      response.refreshToken.refreshTokenExpiration
    ).getTime(),
  };
};
