import { useMutation } from "@tanstack/react-query";
import { useAxiosClient } from "@/shared/providers/AxiosClientProvider";

export const useLogoutRequest = () => {
  const { apiClient } = useAxiosClient();

  return useMutation({
    mutationKey: ["logout.user.request"],
    mutationFn: async () => {
      // For now, keeping mock implementation
      // Replace this with actual API call when ready

      // await apiClient.auth.postApiAuthLogout();

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: { success: true } });
        }, 500);
      });

      // When ready to use real API, replace above with:
      // const response = await apiClient.post(ApiEndpoint.LOGOUT);
      // return response.data;
    },
  });
};
