import type { ManageableUser } from "@/shared/types";

/**
 * View mode for displaying users
 */
export type ViewMode = "table" | "grid";

/**
 * Stats data for users overview
 */
export type UsersStats = {
  total: number;
  active: number;
  pending: number;
  admins: number;
};

/**
 * State for the view-all users use case
 */
export type ViewAllUsersState = {
  // Data
  users: ManageableUser[];
  stats?: UsersStats;
  totalUsers: number;
  totalPages: number;

  // UI state
  viewMode: ViewMode;
  searchQuery: string;
  selectedUserIds: string[];
  currentPage: number;
  pageSize: number;

  // Loading states
  isLoading: boolean;
  isRefreshing: boolean;

  // Derived state
  hasUsers: boolean;
  hasSelectedUsers: boolean;
  hasSearch: boolean;
  canGoToNextPage: boolean;
  canGoToPreviousPage: boolean;
};

/**
 * Actions available in the view-all users use case
 */
export type ViewAllUsersActions = {
  // Search actions
  handleSearch: (query: string) => void;
  clearSearch: () => void;

  // View mode actions
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;

  // Selection actions
  selectUser: (userId: string) => void;
  unselectUser: (userId: string) => void;
  selectAllUsers: () => void;
  clearSelection: () => void;
  toggleUserSelection: (userId: string) => void;

  // Pagination actions
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  setPageSize: (size: number) => void;
  setCurrentPage: (page: number) => void;

  // Refresh action
  refresh: () => void;
};
