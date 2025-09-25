import { useQuery } from "@tanstack/react-query";
import { FAKE_MANAGEABLE_USERS } from "./mockData";
import { useAxiosClient } from "@/shared/providers/AxiosClientProvider";
import { FindUserByIdResponse, USERS_REQUEST_BASE_QUERY_KEY } from "./types";

export const useFindByIdUsersRequest = (id: string) => {
  const { apiClient } = useAxiosClient();
  return useQuery({
    queryKey: [...USERS_REQUEST_BASE_QUERY_KEY, id],
    queryFn: async (): Promise<FindUserByIdResponse> => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const result = fetchFakeUserById(id);
      if (!result.successful) {
        throw new Error(result.message);
      }
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

const fetchFakeUserById = (id: string): FindUserByIdResponse => {
  const user = FAKE_MANAGEABLE_USERS.find((user) => user.id === id);

  return {
    message: user
      ? "Fetched user successfully (fake response)"
      : "User not found",
    statusCode: user ? 200 : 404,
    successful: !!user,
    data: user || null,
  };
};
