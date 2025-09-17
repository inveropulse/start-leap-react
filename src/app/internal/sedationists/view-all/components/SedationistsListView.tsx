import { useSedationistList } from "../hooks/useSedationistList";
import { useSedationistListStats } from "../hooks/useSedationistListStats";
import SedationistCard from "./SedationistCard";
import {
  Sedationist,
  SedationistFilters as FilterType,
} from "@/shared/types/domains/sedationist";
import {
  ListViewHeader,
  ListViewStats,
  ListViewContent,
  ListViewPagination,
} from "../../../shared";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {
  Grid,
  List,
  RefreshCw,
  Users,
  UserCheck,
  Calendar,
  Award,
} from "lucide-react";
import SedationistFilters from "./SedationistFilters";

export interface SedationistsListViewProps {
  onAddSedationist?: () => void;
  onViewSedationist?: (sedationistId: string) => void;
}

export default function SedationistsListView({
  onAddSedationist,
  onViewSedationist,
}: SedationistsListViewProps) {
  // Use business logic hooks
  const {
    sedationists,
    totalCount,
    totalPages,
    currentPage,
    searchValue,
    viewMode,
    isLoading,
    error,
    onSearchChange,
    onPageChange,
    onViewModeToggle,
    onRefresh,
    onStatusFilter,
  } = useSedationistList();

  const {
    totalSedationists,
    activeSedationists,
    onLeaveSedationists,
    inTrainingSedationists,
    averagePatientRating,
  } = useSedationistListStats();

  // 1. Handle sedationist click
  const handleViewSedationist = (sedationist: Sedationist) => {
    if (sedationist.id && onViewSedationist) {
      onViewSedationist(sedationist.id);
    }
  };

  // 2. Handle add sedationist
  const handleAddClick = () => {
    if (onAddSedationist) {
      onAddSedationist();
    }
  };

  // 3. Handle filter change from the filters component
  const handleFiltersChange = (filters: FilterType) => {
    // Update individual hook state based on filter changes
    onSearchChange(filters.search);
    onStatusFilter(filters.status);
    // Add additional filter handlers as needed
  };

  // Create filters object for the component
  const filters: FilterType = {
    search: searchValue,
    status: [], // This should come from the hook state
    specialty: [],
    location: "",
    certificationStatus: [],
    availableToday: false,
    showInactive: false,
  };

  if (error) {
    return (
      <div className="space-y-6">
        <ListViewHeader
          title="Sedationists"
          description="Manage sedationist profiles, certifications, and availability"
          onAdd={handleAddClick}
          addButtonText="Add Sedationist"
        />
        <ListViewContent
          viewMode={viewMode}
          error="Error loading sedationists"
          onRetry={onRefresh}
        />
      </div>
    );
  }

  // Calculate stats for ListViewStats component
  const stats = [
    {
      id: "total",
      label: "Total Sedationists",
      value: totalSedationists,
      icon: Users,
      color: "default" as const,
      description: "All registered sedationists",
    },
    {
      id: "active",
      label: "Active",
      value: activeSedationists,
      icon: UserCheck,
      color: "success" as const,
      description: "Currently practicing",
    },
    {
      id: "onLeave",
      label: "On Leave",
      value: onLeaveSedationists,
      icon: Calendar,
      color: "warning" as const,
      description: "Temporarily unavailable",
    },
    {
      id: "inTraining",
      label: "In Training",
      value: inTrainingSedationists,
      icon: Award,
      color: "primary" as const,
      description: "Under supervision",
    },
  ];

  return (
    <div className="space-y-6">
      <ListViewHeader
        title="Sedationists"
        description="Manage sedationist profiles, certifications, and availability"
        onAdd={handleAddClick}
        addButtonText="Add Sedationist"
      />

      <ListViewStats stats={stats} isLoading={isLoading} />

      {/* Custom Controls Card */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* View Mode Toggle */}
            <div className="flex justify-end">
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={onViewModeToggle}
                  disabled={isLoading}
                  className="rounded-r-none border-r-0"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={onViewModeToggle}
                  disabled={isLoading}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
                className="ml-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>

            {/* Sedationist-specific Search & Filters */}
            <SedationistFilters
              filters={filters}
              isLoading={isLoading}
              showSearchButton={true}
              onFiltersChange={handleFiltersChange}
            />
          </div>
        </CardContent>
      </Card>

      <ListViewContent
        viewMode={viewMode}
        isLoading={isLoading}
        isEmpty={sedationists.length === 0}
        emptyMessage={
          searchValue
            ? "Try adjusting your search or filters"
            : "Get started by adding your first sedationist"
        }
        emptyAction={
          !searchValue
            ? {
                label: "Add Sedationist",
                onClick: handleAddClick,
              }
            : undefined
        }
      >
        {sedationists.map((sedationist) => (
          <SedationistCard
            key={sedationist.id}
            sedationist={sedationist}
            viewMode={viewMode}
            onClick={() => handleViewSedationist(sedationist)}
          />
        ))}
      </ListViewContent>

      {totalPages > 1 && (
        <ListViewPagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={25}
          totalCount={totalCount}
          onPageChange={onPageChange}
          onPageSizeChange={() => {}} // Not implemented yet
        />
      )}
    </div>
  );
}
