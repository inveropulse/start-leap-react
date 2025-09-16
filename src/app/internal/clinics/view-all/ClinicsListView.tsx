import { ClinicCard } from "../shared/components/ClinicCard";
import { ClinicFilters } from "./ClinicFilters";
import {
  ListViewHeader,
  ListViewStats,
  ListViewControls,
  ListViewContent,
  ListViewPagination,
} from "../../shared";
import { useClinicList } from "./useClinicList";
import { useClinicListStats } from "./useClinicListStats";

interface ClinicsListViewProps {
  onAddClinic: () => void;
  onViewClinic: (id: string) => void;
}

export function ClinicsListView({
  onAddClinic,
  onViewClinic,
}: ClinicsListViewProps) {
  const {
    // Data
    clinics,
    totalCount,
    currentPage,
    totalPages,
    pageSize,

    // Search and filters
    searchText,
    filters,
    showFilters,
    hasActiveFilters,

    // View state
    viewMode,
    isEmpty,
    emptyMessage,

    // Loading states
    isLoading,
    error,

    // Actions
    handleSearchChange,
    handleFiltersChange,
    handlePageChange,
    handlePageSizeChange,
    handleRefresh,
    toggleViewMode,
    toggleFilters,
    clearFiltersAndSearch,
  } = useClinicList();

  const stats = useClinicListStats({ clinics, totalCount, isLoading });

  const emptyAction =
    hasActiveFilters || searchText
      ? {
          label: "Clear Filters",
          onClick: clearFiltersAndSearch,
        }
      : {
          label: "Add First Clinic",
          onClick: onAddClinic,
        };

  return (
    <div className="space-y-6">
      {/* Header */}
      <ListViewHeader
        title="Clinics Management"
        description="Manage and monitor all registered clinics"
        onAdd={onAddClinic}
        addButtonText="Add Clinic"
      />

      {/* Stats */}
      <ListViewStats stats={stats} isLoading={isLoading} />

      {/* Search and Controls */}
      <ListViewControls
        searchValue={searchText}
        onSearchChange={handleSearchChange}
        searchMinLength={3}
        showSearchButton={true}
        searchPlaceholder="Search clinics by name, location, or contact person..."
        viewMode={viewMode}
        onViewModeToggle={toggleViewMode}
        onRefresh={handleRefresh}
        isLoading={isLoading}
        showFilters={true}
        filtersActive={hasActiveFilters}
        onToggleFilters={toggleFilters}
      >
        {showFilters && (
          <ClinicFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        )}
      </ListViewControls>

      {/* Content */}
      <ListViewContent
        viewMode={viewMode}
        isLoading={isLoading}
        error={error}
        isEmpty={isEmpty}
        emptyMessage={emptyMessage}
        emptyAction={emptyAction}
        onRetry={handleRefresh}
        loadingSkeletonCount={6}
      >
        {clinics.map((clinic) => (
          <ClinicCard
            key={clinic.id}
            clinic={clinic}
            viewMode={viewMode}
            onView={() => onViewClinic(clinic.id!)}
          />
        ))}
      </ListViewContent>

      {/* Pagination */}
      <ListViewPagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        isLoading={isLoading}
      />
    </div>
  );
}
