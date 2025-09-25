import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosClient } from "@/shared/providers/AxiosClientProvider";
import { DeleteUserResponse, USERS_REQUEST_BASE_QUERY_KEY } from "./types";

import type { DeleteUserRequest } from "@/app/internal/users/delete/types";

export const useDeleteUserRequest = () => {
  const queryClient = useQueryClient();
  const { apiClient } = useAxiosClient();

  return useMutation({
    mutationKey: ["delete.user.request"],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...USERS_REQUEST_BASE_QUERY_KEY],
      });
    },
    mutationFn: async (req: DeleteUserRequest): Promise<DeleteUserResponse> => {
      return createFakeUserResponse(req);
    },
  });
};

const createFakeUserResponse = (req: { userId: string; reason?: string }) => {
  return {
    data: true,
    successful: true,
    message: "User deleted successfully (fake response)",
    statusCode: 200,
  };
};

// Imperative API for use-case hook
export async function deleteUser(req: { userId: string; reason?: string }) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    data: true,
    successful: true,
    message: "User deleted successfully (fake response)",
    statusCode: 200,
  };
  // Real API call (uncomment when backend is ready):
  // return apiClient.users.deleteUser(req);
}
