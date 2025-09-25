import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "@/shared/providers/AxiosClientProvider";
import { USERS_REQUEST_BASE_QUERY_KEY } from "./types";
import { FindUserSessionsResponse } from "./types";
import { FAKE_USER_SESSIONS } from "./mockData";

export const useFindUserSessionsRequest = (userId: string | null) => {
  const { apiClient } = useAxiosClient();

  return useQuery({
    queryKey: [...USERS_REQUEST_BASE_QUERY_KEY, "sessions", userId],
    queryFn: async (): Promise<FindUserSessionsResponse> => {
      // Simulate network delay for realistic UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      return fetchFakeUserSessions(userId);
      // return apiClient.users.findUserSessions(userId); // Real API call (commented)
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes - consistent with other endpoints
  });
};

const fetchFakeUserSessions = (
  userId: string | null
): FindUserSessionsResponse => {
  if (!userId) {
    return {
      message: "User ID is required",
      statusCode: 400,
      successful: false,
      data: [],
    };
  }

  const userSessions = FAKE_USER_SESSIONS.filter(
    (session) => session.userId === userId
  );

  return {
    message: "Fetched user sessions successfully (fake response)",
    statusCode: 200,
    successful: true,
    data: userSessions,
  };
};
