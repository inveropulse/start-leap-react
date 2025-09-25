import { useViewAllUsers } from "../hooks/useViewAllUsers";
import { useState } from "react";
import UserManagementModal from "@/app/internal/users/profile/UserManagementModal";
import DeleteUserDialog from "@/app/internal/users/delete/DeleteUserDialog";
import DeactivateUserDialog from "@/app/internal/users/deactivate/DeactivateUserDialog";
import ListViewStats from "./ListViewStats";
import ViewAllUsersHeader from "./ViewAllUsersHeader";
import ViewAllUsersFilters from "./ViewAllUsersFilters";
import UserListView from "../../shared/components/UserListView";
import { useToast } from "@/shared/hooks/use-toast";
import { Button } from "@/shared/components/ui/button";
import type { ManageableUser } from "@/shared/types";
import { ListViewPagination } from "@/app/internal/shared/components/ListView/ListViewPagination";
import UserGridView from "./UserGridView";

export interface ViewAllUsersProps {}

/**
 * High cohesion view-all users component
 * Uses custom hook for business logic separation
 * Follows Single Responsibility Principle for UI rendering
 */
export default function ViewAllUsers(props: ViewAllUsersProps) {
  const { state, actions } = useViewAllUsers();
  const { toast } = useToast();

  // Modal/dialog state
  const [modal, setModal] = useState<
    null | "profile" | "delete" | "deactivate"
  >(null);
  const [activeUser, setActiveUser] = useState<ManageableUser | null>(null);

  const handleUserAction = (action: string, user: ManageableUser) => {
    switch (action) {
      case "view":
      case "edit":
        setActiveUser(user);
        setModal("profile");
        break;
      case "delete":
        setActiveUser(user);
        setModal("delete");
        break;
      case "deactivate":
        setActiveUser(user);
        setModal("deactivate");
        break;
      default:
        toast({
          title: "Unknown Action",
          description: `Action \"${action}\" is not implemented.`,
          variant: "destructive",
        });
    }
  };

  const handleCloseModal = () => {
    setModal(null);
    setActiveUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <ViewAllUsersHeader />

      {/* Stats */}
      <ListViewStats />

      {/* Filters and Controls - Extracted to separate component */}
      <ViewAllUsersFilters
        searchQuery={state.searchQuery}
        onSearchChange={actions.handleSearch} // ✅ Single callback for search execution
        autoSearch={false} // ✅ Control search behavior
        pageSize={state.pageSize}
        onPageSizeChange={actions.setPageSize}
        viewMode={state.viewMode}
        onViewModeChange={actions.setViewMode}
        onRefresh={actions.refresh}
        isRefreshing={state.isRefreshing}
        isLoading={state.isLoading}
      />

      {/* Selection Info */}
      {state.hasSelectedUsers && (
        <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
          <span className="text-sm text-blue-700">
            {state.selectedUserIds.length} user
            {state.selectedUserIds.length !== 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Bulk Actions
            </Button>
            <Button variant="ghost" size="sm" onClick={actions.clearSelection}>
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {state.isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading users...</span>
        </div>
      )}

      {/* Data Table */}
      {!state.isLoading && state.viewMode === "table" && (
        <UserListView
          users={state.users}
          selectedUserIds={state.selectedUserIds}
          onSelectionChange={actions.selectAllUsers}
          onUserSelect={actions.toggleUserSelection}
          onUserAction={handleUserAction}
        />
      )}

      {/* Grid View */}
      {!state.isLoading && state.viewMode === "grid" && (
        <UserGridView
          users={state.users}
          selectedUserIds={state.selectedUserIds}
          onUserSelect={actions.toggleUserSelection}
          onUserAction={handleUserAction}
        />
      )}

      {/* Empty State */}
      {!state.isLoading && !state.hasUsers && state.hasSearch && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">
            No users found for "{state.searchQuery}"
          </p>
          <Button variant="outline" onClick={actions.clearSearch}>
            Clear Search
          </Button>
        </div>
      )}

      {/* Pagination */}
      {state.hasUsers && (
        <ListViewPagination
          currentPage={state.currentPage}
          totalPages={state.totalPages}
          pageSize={state.pageSize}
          totalCount={state.totalUsers}
          onPageChange={actions.setCurrentPage}
          onPageSizeChange={actions.setPageSize}
          isLoading={state.isLoading}
        />
      )}
      {/* Profile Modal (view/edit, per-tab edit mode handled inside) */}
      {modal === "profile" && activeUser && (
        <UserManagementModal
          user={activeUser}
          open={true}
          onClose={handleCloseModal}
        />
      )}
      {modal === "delete" && activeUser && (
        <DeleteUserDialog
          user={activeUser}
          open={true}
          onClose={handleCloseModal}
          onSuccess={actions.refresh}
        />
      )}
      {modal === "deactivate" && activeUser && (
        <DeactivateUserDialog
          user={activeUser}
          open={true}
          onClose={handleCloseModal}
          onSuccess={actions.refresh}
        />
      )}
    </div>
  );
}
