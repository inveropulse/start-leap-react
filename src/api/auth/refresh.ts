import { useMutation } from "@tanstack/react-query";

export interface RefreshTokenRequest {
  token: string;
  refreshToken: string;
}

export const useRefreshTokenRequest = () => {
  return useMutation({
    mutationKey: ["refresh.user.access.token.request"],
    mutationFn: (req: RefreshTokenRequest) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: { token: req.token, refresh: req.refreshToken } });
        }, 1000);
      });
    },
  });
};
