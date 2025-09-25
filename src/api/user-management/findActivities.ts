import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "@/shared/providers/AxiosClientProvider";
import { USERS_REQUEST_BASE_QUERY_KEY } from "./types";
import { FindUserActivitiesResponse } from "./types";
import { FAKE_USER_ACTIVITIES } from "./mockData";

export const useFindUserActivitiesRequest = (userId: string | null) => {
  const { apiClient } = useAxiosClient();

  return useQuery({
    queryKey: [...USERS_REQUEST_BASE_QUERY_KEY, "activities", userId],
    queryFn: async (): Promise<FindUserActivitiesResponse> => {
      // Simulate network delay for realistic UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      return fetchFakeUserActivities(userId);
      // return apiClient.users.findUserActivities(userId); // Real API call (commented)
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes - consistent with other endpoints
  });
};

const fetchFakeUserActivities = (
  userId: string | null
): FindUserActivitiesResponse => {
  if (!userId) {
    return {
      message: "User ID is required",
      statusCode: 400,
      successful: false,
      data: [],
    };
  }

  const userActivities = FAKE_USER_ACTIVITIES.filter(
    (activity) => activity.userId === userId
  );

  return {
    message: "Fetched user activities successfully (fake response)",
    statusCode: 200,
    successful: true,
    data: userActivities,
  };
};
