import {
  UserSearchParams,
  FindAllUsersResponse,
  USERS_REQUEST_BASE_QUERY_KEY,
} from "./types";
import { useQuery } from "@tanstack/react-query";
import { FAKE_MANAGEABLE_USERS } from "./mockData";
import { useAxiosClient } from "@/shared/providers/AxiosClientProvider";

export const useFindAllUsersRequest = (params: UserSearchParams) => {
  const { apiClient } = useAxiosClient();
  return useQuery({
    queryKey: [...USERS_REQUEST_BASE_QUERY_KEY, params],
    queryFn: async (): Promise<FindAllUsersResponse> => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return fetchFakeAllUsers(params);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

const fetchFakeAllUsers = (params: UserSearchParams): FindAllUsersResponse => {
  let filteredUsers = [...FAKE_MANAGEABLE_USERS];

  // Filtering
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredUsers = filteredUsers.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.role.toLowerCase().includes(searchLower)
    );
  }

  if (params.status && params.status.length > 0) {
    filteredUsers = filteredUsers.filter((user) =>
      params.status!.includes(user.status)
    );
  }

  if (params.roles && params.roles.length > 0) {
    filteredUsers = filteredUsers.filter((user) =>
      params.roles!.includes(user.role)
    );
  }

  if (params.departments && params.departments.length > 0) {
    filteredUsers = filteredUsers.filter((user) =>
      params.departments!.includes(user.department)
    );
  }

  if (params.sortBy && params.sortOrder) {
    filteredUsers.sort((a, b) => {
      const fieldA = a[params.sortBy!];
      const fieldB = b[params.sortBy!];
      if (fieldA === undefined) return 1;
      if (fieldB === undefined) return -1;
      if (fieldA < fieldB) return params.sortOrder === "asc" ? -1 : 1;
      if (fieldA > fieldB) return params.sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }

  // Pagination
  const totalItems = filteredUsers.length;
  const start = ((params.pageNo || 1) - 1) * (params.pageSize || 10);
  const end = start + (params.pageSize || 10);
  filteredUsers = filteredUsers.slice(start, end);

  return {
    data: filteredUsers,
    pageNo: params.pageNo || 1,
    pageSize: params.pageSize || 10,
    totalItems: totalItems || 0,
    totalPages: Math.ceil(totalItems / (params.pageSize || 10)),
  };
};
