import { useState } from "react";
import { Plus, Search, Filter, Grid, List, Download } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useUsersRequest } from "../hooks/useUsersRequest";
import { UserFilters, UserStatus, Department, PermissionLevel } from "../types";
import { UserRole } from "@/shared/types";
import { UserCard } from "./UserCard";
import { UserFilters as UserFiltersComponent } from "./UserFilters";
import { UserPagination } from "./UserPagination";

interface UsersListViewProps {
  onAddUser: () => void;
}

export function UsersListView({ onAddUser }: UsersListViewProps) {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
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
    if (!usersData) return { total: 0, active: 0, pending: 0, admins: 0 };

    return {
      total: usersData.totalCount,
      active: usersData.items.filter(user => user.status === UserStatus.ACTIVE).length,
      pending: usersData.items.filter(user => user.status === UserStatus.PENDING_ACTIVATION).length,
      admins: usersData.items.filter(user => user.role === UserRole.ADMIN).length,
    };
  };

  const stats = getStatsData();

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <p>Error loading users. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage internal users, roles, and permissions
          </p>
        </div>
        <Button onClick={onAddUser} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-2xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Users</CardDescription>
            <CardTitle className="text-2xl text-green-600">{stats.active}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Activation</CardDescription>
            <CardTitle className="text-2xl text-orange-600">{stats.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Administrators</CardDescription>
            <CardTitle className="text-2xl text-blue-600">{stats.admins}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search bar and controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search users by name, email, or role..."
                  value={filters.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {getActiveFiltersCount() > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {getActiveFiltersCount()}
                    </Badge>
                  )}
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "table" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <UserFiltersComponent
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={clearFilters}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "table")}>
        <TabsContent value="grid" className="mt-0">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-full" />
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded w-24" />
                          <div className="h-3 bg-muted rounded w-32" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-muted rounded w-full" />
                        <div className="h-3 bg-muted rounded w-2/3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : usersData && usersData.items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {usersData.items.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground py-12">
                  <p className="text-lg mb-2">No users found</p>
                  <p className="text-sm">
                    {filters.search || getActiveFiltersCount() > 0
                      ? "Try adjusting your search or filters"
                      : "Get started by adding your first user"}
                  </p>
                  {(!filters.search && getActiveFiltersCount() === 0) && (
                    <Button onClick={onAddUser} className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="table" className="mt-0">
          {/* Table view would go here - simplified for now */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground py-12">
                <p>Table view coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      {usersData && usersData.totalPages > 1 && (
        <UserPagination
          currentPage={currentPage}
          totalPages={usersData.totalPages}
          totalCount={usersData.totalCount}
          pageSize={usersData.pageSize}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}