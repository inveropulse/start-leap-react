import { useMutation } from "@tanstack/react-query";
import { useAxiosClient } from "@/shared/provider/AxiosClientProvider";
import { APP_CONFIG } from "@/shared/AppConfig";
import { PortalType } from "@/shared/services/auth/types";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  data: {
    user: {
      id: string;
      email: string;
      name?: string;
      role?: string;
      portalAccess?: Record<string, boolean>;
      portalRoles?: Record<string, string[]>;
    };
    accessToken?: string;
    token?: string;
    refreshToken?: string;
    refresh?: string;
    expiresIn?: number;
    expires?: number;
  };
};

export const useLoginRequest = () => {
  const { apiClient } = useAxiosClient();

  return useMutation({
    mutationKey: ["login.user.request"],
    mutationFn: async (req: LoginRequest): Promise<LoginResponse> => {
      // For now, keeping mock implementation but using the axios client
      // Replace this with actual API call when ready
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              user: {
                id: req.email,
                email: req.email,
                name: req.email.split("@")[0],
                role: "user",
                portalAccess: {
                  [PortalType.CLINIC]: true,
                  [PortalType.INTERNAL]: false,
                  [PortalType.PATIENT]: true,
                  [PortalType.SEDATIONIST]: false,
                },
                portalRoles: {
                  [PortalType.CLINIC]: ["user"],
                  [PortalType.PATIENT]: ["user"],
                },
              },
              accessToken: "mock-access-token-" + Date.now(),
              refreshToken: "mock-refresh-token-" + Date.now(),
              expiresIn: APP_CONFIG.auth.tokenLifetime,
            },
          });
        }, 1000);
      });

      // When ready to use real API, replace above with:
      // const response = await axios.post(ApiEndpoint.LOGIN, req);
      // return response.data;
    },
  });
};
