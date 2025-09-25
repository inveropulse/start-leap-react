import { FAKE_USER_STATS } from "./mockData";
import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "@/shared/providers/AxiosClientProvider";
import { USERS_REQUEST_BASE_QUERY_KEY, UsersStatsResponse } from "./types";

export const useGetUsersStatsRequest = () => {
  const { apiClient } = useAxiosClient();
  return useQuery({
    queryKey: [...USERS_REQUEST_BASE_QUERY_KEY, "stats"],
    queryFn: async (): Promise<UsersStatsResponse> => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        data: FAKE_USER_STATS,
        message: "Fetched user stats successfully",
        statusCode: 200,
        successful: true,
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
