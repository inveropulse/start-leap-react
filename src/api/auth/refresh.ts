import { useMutation } from "@tanstack/react-query";
import { useAxiosClient } from "@/shared/provider/AxiosClientProvider";
import { APP_CONFIG } from "@/shared/AppConfig";

export interface RefreshTokenRequest {
  token: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  data: {
    token?: string;
    accessToken?: string;
    refresh?: string;
    refreshToken?: string;
    expiresIn?: number;
    expires?: number;
  };
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
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              token: "new-mock-access-token-" + Date.now(),
              refresh: "new-mock-refresh-token-" + Date.now(),
              expiresIn: APP_CONFIG.auth.tokenLifetime,
            },
          });
        }, 500);
      });

      // When ready to use real API, replace above with:
      // const response = await axios.post(ApiEndpoint.REFRESH, req);
      // return response.data;
    },
  });
};
