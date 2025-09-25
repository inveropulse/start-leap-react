import { useState, useMemo } from "react";
import {
  useFindAllUsersRequest,
  useGetUsersStatsRequest,
} from "@/api/user-management";
import type { UserSearchParams } from "@/api/user-management/types";
import { ViewAllUsersActions, ViewAllUsersState, ViewMode } from "../types";

/**
 * Hook for managing the view-all users use case
 * Encapsulates all business logic for the users list view
 */

export const useViewAllUsers = () => {
  // Single state for all search/filter/pagination params
  const [searchParams, setSearchParams] = useState<UserSearchParams>({
    pageNo: 1,
    pageSize: 10,
    search: "",
  });

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Memoize searchParams to avoid unnecessary re-renders
  const memoizedSearchParams = useMemo(() => searchParams, [searchParams]);

  // API requests
  const usersQuery = useFindAllUsersRequest(memoizedSearchParams);
  const statsQuery = useGetUsersStatsRequest();

  // Derived state
  const users = useMemo(() => usersQuery.data?.data || [], [usersQuery.data]);
  const totalUsers = useMemo(
    () => usersQuery.data?.totalItems || 0,
    [usersQuery.data]
  );
  const isLoading = usersQuery.isPending || statsQuery.isPending;
  const hasUsers = users.length > 0;
  const hasSelectedUsers = selectedUserIds.length > 0;

  // Actions
  const actions: ViewAllUsersActions = {
    // Search actions
    handleSearch: (query: string) => {
      setSearchParams((prev) =>
        prev.search === query ? prev : { ...prev, search: query, pageNo: 1 }
      );
    },
    clearSearch: () => {
      setSearchParams((prev) =>
        prev.search === "" ? prev : { ...prev, search: "", pageNo: 1 }
      );
    },

    // View mode actions
    setViewMode,
    toggleViewMode: () => {
      setViewMode((prev) => (prev === "table" ? "grid" : "table"));
    },

    // Selection actions
    selectUser: (userId: string) => {
      setSelectedUserIds((prev) => [...prev, userId]);
    },
    unselectUser: (userId: string) => {
      setSelectedUserIds((prev) => prev.filter((id) => id !== userId));
    },
    selectAllUsers: () => {
      setSelectedUserIds(users.map((user) => user.id!));
    },
    clearSelection: () => {
      setSelectedUserIds([]);
    },
    toggleUserSelection: (userId: string) => {
      setSelectedUserIds((prev) =>
        prev.includes(userId)
          ? prev.filter((id) => id !== userId)
          : [...prev, userId]
      );
    },

    // Pagination actions
    setCurrentPage: (page: number) => {
      setSearchParams((prev) =>
        prev.pageNo === page ? prev : { ...prev, pageNo: page }
      );
    },
    goToPage: (page: number) => {
      setSearchParams((prev) =>
        prev.pageNo === page ? prev : { ...prev, pageNo: page }
      );
    },
    goToNextPage: () => {
      setSearchParams((prev) =>
        prev.pageNo < (usersQuery.data?.totalPages || 1)
          ? { ...prev, pageNo: prev.pageNo + 1 }
          : prev
      );
    },
    goToPreviousPage: () => {
      setSearchParams((prev) =>
        prev.pageNo > 1 ? { ...prev, pageNo: prev.pageNo - 1 } : prev
      );
    },
    setPageSize: (size: number) => {
      setSearchParams((prev) =>
        prev.pageSize === size ? prev : { ...prev, pageSize: size, pageNo: 1 }
      );
    },

    // Refresh action
    refresh: () => {
      usersQuery.refetch();
      statsQuery.refetch();
    },
  };

  // State object
  const state: ViewAllUsersState = {
    // Data
    users,
    stats: statsQuery.data?.data,
    totalUsers,
    totalPages: usersQuery.data?.totalPages || 1,

    // UI state
    viewMode,
    searchQuery: searchParams.search || "",
    selectedUserIds,
    currentPage: searchParams.pageNo!,
    pageSize: searchParams.pageSize!,

    // Loading states
    isLoading,
    isRefreshing: usersQuery.isFetching || statsQuery.isFetching,

    // Derived state
    hasUsers,
    hasSelectedUsers,
    hasSearch: !!(searchParams.search && searchParams.search.trim()),
    canGoToNextPage:
      (searchParams.pageNo || 1) < (usersQuery.data?.totalPages || 1),
    canGoToPreviousPage: (searchParams.pageNo || 1) > 1,
  };

  return {
    state,
    actions,
  };
};
