import { USERS_REQUEST_BASE_QUERY_KEY } from "./types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserStatus } from "@/shared/types";
import { useAxiosClient } from "@/shared/providers/AxiosClientProvider";
import type {
  DeactivateUserRequest,
  DeactivateUserResponse,
} from "@/app/internal/users/deactivate/types";

export const useDeactivateUserRequest = () => {
  const queryClient = useQueryClient();
  const { apiClient } = useAxiosClient();

  return useMutation<DeactivateUserResponse, Error, DeactivateUserRequest>({
    mutationKey: ["deactivate.user.request"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...USERS_REQUEST_BASE_QUERY_KEY],
      });
    },
    mutationFn: async (
      req: DeactivateUserRequest
    ): Promise<DeactivateUserResponse> => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        success: true,
        message: "User deactivated successfully (fake response)",
      };
      // Real API call (uncomment when backend is ready):
      // return apiClient.users.deactivateUser(req);
    },
  });
};

// For direct imperative use (not TanStack Query)
export async function deactivateUser(
  req: DeactivateUserRequest
): Promise<DeactivateUserResponse> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    success: true,
    message: "User deactivated successfully (fake response)",
  };
  // Real API call (uncomment when backend is ready):
  // return apiClient.users.deactivateUser(req);
}
