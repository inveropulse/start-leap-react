import { useState } from "react";
import { Users, UserCheck, Shield, Clock } from "lucide-react";
import { useUsersRequest } from "../hooks/useUsersRequest";
import { UserFilters, UserStatus, Department, PermissionLevel } from "../types";
import { UserRole } from "@/shared/types";
import { UserCard } from "./UserCard";
import { UserFilters as UserFiltersComponent } from "./UserFilters";
import {
  ListViewHeader,
  ListViewStats,
  ListViewControls,
  ListViewContent,
  ListViewPagination
} from "../../shared";

interface UsersListViewProps {
  onAddUser: () => void;
}

export function UsersListView({ onAddUser }: UsersListViewProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    status: [],
    roles: [],
    departments: [],
    permissionLevels: [],
    lastLoginAfter: "",
  });

  const searchParams = {
    search: filters.search || undefined,
    status: filters.status.length > 0 ? filters.status : undefined,
    roles: filters.roles.length > 0 ? filters.roles : undefined,
    departments: filters.departments.length > 0 ? filters.departments : undefined,
    permissionLevels: filters.permissionLevels.length > 0 ? filters.permissionLevels : undefined,
    pageNo: currentPage,
    pageSize: 25,
  };

  const { data: usersData, isLoading, error } = useUsersRequest(searchParams);

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
    setCurrentPage(1); // Reset to first page on search
  };

  const handleFiltersChange = (newFilters: Partial<UserFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: [],
      roles: [],
      departments: [],
      permissionLevels: [],
      lastLoginAfter: "",
    });
    setCurrentPage(1);
  };

  const getActiveFiltersCount = () => {
    return (
      (filters.status.length > 0 ? 1 : 0) +
      (filters.roles.length > 0 ? 1 : 0) +
      (filters.departments.length > 0 ? 1 : 0) +
      (filters.permissionLevels.length > 0 ? 1 : 0) +
      (filters.lastLoginAfter ? 1 : 0)
    );
  };

  const getStatsData = () => {
    if (!usersData) return [];
    
    const total = usersData.totalCount;
    const active = usersData.items.filter(user => user.status === UserStatus.ACTIVE).length;
    const pending = usersData.items.filter(user => user.status === UserStatus.PENDING_ACTIVATION).length;
    const admins = usersData.items.filter(user => user.role === UserRole.ADMIN).length;

    return [
      {
        id: 'total',
        label: 'Total Users',
        value: total,
        icon: Users,
        color: 'default' as const,
        description: 'All registered users'
      },
      {
        id: 'active',
        label: 'Active Users',
        value: active,
        icon: UserCheck,
        color: 'success' as const,
        description: 'Currently active'
      },
      {
        id: 'pending',
        label: 'Pending Activation',
        value: pending,
        icon: Clock,
        color: 'warning' as const,
        description: 'Awaiting activation'
      },
      {
        id: 'admins',
        label: 'Administrators',
        value: admins,
        icon: Shield,
        color: 'primary' as const,
        description: 'Admin privileges'
      }
    ];
  };

  const stats = getStatsData();

  if (error) {
    return (
      <div className="space-y-6">
        <ListViewHeader
          title="User Management"
          description="Manage internal users, roles, and permissions"
          onAdd={onAddUser}
          addButtonText="Add User"
        />
        
        <ListViewContent
          viewMode={viewMode}
          error="Error loading users. Please try again later."
        />
      </div>
    );
  }

  const handleRefresh = () => {
    // Refetch logic would go here if available
  };

  return (
    <div className="space-y-6">
      <ListViewHeader
        title="User Management"
        description="Manage internal users, roles, and permissions"
        onAdd={onAddUser}
        addButtonText="Add User"
      />
      
      <ListViewStats stats={stats} isLoading={isLoading} />
      
      <ListViewControls
        searchValue={filters.search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search users by name, email, or role..."
        viewMode={viewMode}
        onViewModeToggle={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
        onRefresh={handleRefresh}
        isLoading={isLoading}
        showFilters={true}
        filtersActive={getActiveFiltersCount()}
        onToggleFilters={() => setShowFilters(!showFilters)}
      >
        {showFilters && (
          <UserFiltersComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={clearFilters}
          />
        )}
      </ListViewControls>

      <ListViewContent
        viewMode={viewMode}
        isLoading={isLoading}
        isEmpty={usersData?.items.length === 0}
        emptyMessage={
          filters.search || getActiveFiltersCount() > 0
            ? "Try adjusting your search or filters"
            : "Get started by adding your first user"
        }
        emptyAction={(!filters.search && getActiveFiltersCount() === 0) ? {
          label: "Add User",
          onClick: onAddUser
        } : undefined}
      >
        {usersData?.items.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </ListViewContent>

      {usersData && usersData.totalPages > 1 && (
        <ListViewPagination
          currentPage={currentPage}
          totalPages={usersData.totalPages}
          pageSize={usersData.pageSize}
          totalCount={usersData.totalCount}
          onPageChange={setCurrentPage}
          onPageSizeChange={(pageSize) => {
            // Handle page size change if needed
          }}
        />
      )}
    </div>
  );
}