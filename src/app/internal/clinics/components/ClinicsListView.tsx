import { useState, useMemo } from "react";
import { Building2, CheckCircle, MapPin, Users } from "lucide-react";
import { useClinicsRequest } from "../hooks/useClinicRequests";
import { ClinicSearchParams, ClinicStatus } from "../types/clinic.types";
import { ClinicCard } from "./ClinicCard";
import { ClinicFilters } from "./ClinicFilters";
import { 
  ListViewHeader,
  ListViewStats,
  ListViewControls,
  ListViewContent,
  ListViewPagination,
  ListViewStat
} from "../../shared";
import { Button } from "@/shared/components/ui/button";

interface ClinicsListViewProps {
  onAddClinic: () => void;
  onViewClinic: (id: string) => void;
}

export function ClinicsListView({ onAddClinic, onViewClinic }: ClinicsListViewProps) {
  const [searchText, setSearchText] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<Partial<ClinicSearchParams>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [showFilters, setShowFilters] = useState(false);

  const searchParams = useMemo<ClinicSearchParams>(() => ({
    search: searchText || undefined,
    page: currentPage,
    pageSize: pageSize,
    ...filters,
  }), [searchText, filters, currentPage, pageSize]);

  const { data, isLoading, error, refetch } = useClinicsRequest(searchParams);

  const handleRefresh = () => {
    refetch();
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === "grid" ? "list" : "grid");
  };

  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleFiltersChange = (newFilters: Partial<ClinicSearchParams>) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const getStats = (): ListViewStat[] => {
    if (!data) {
      return [
        { id: 'total', label: 'Total Clinics', value: 0, icon: Building2, color: 'default' },
        { id: 'active', label: 'Active', value: 0, icon: CheckCircle, color: 'success' },
        { id: 'types', label: 'Types', value: 0, icon: Users, color: 'primary' },
        { id: 'cities', label: 'Cities', value: 0, icon: MapPin, color: 'default' },
      ];
    }

    return [
      { 
        id: 'total', 
        label: 'Total Clinics', 
        value: data.totalCount, 
        icon: Building2, 
        color: 'default',
        description: `${data.clinics.length} on this page`
      },
      { 
        id: 'active', 
        label: 'Active', 
        value: data.clinics.filter(c => c.status === ClinicStatus.ACTIVE).length, 
        icon: CheckCircle, 
        color: 'success',
        description: 'Currently operating'
      },
      { 
        id: 'types', 
        label: 'Clinic Types', 
        value: new Set(data.clinics.map(c => c.type).filter(Boolean)).size, 
        icon: Users, 
        color: 'primary',
        description: 'Different specializations'
      },
      { 
        id: 'cities', 
        label: 'Cities', 
        value: new Set(data.clinics.map(c => c.city).filter(Boolean)).size, 
        icon: MapPin, 
        color: 'default',
        description: 'Locations covered'
      },
    ];
  };

  const hasActiveFilters = Object.keys(filters).length > 0;
  const isEmpty = data && data.clinics.length === 0;
  const emptyMessage = searchText || hasActiveFilters 
    ? "No clinics found matching your criteria"
    : "No clinics registered yet";
  const emptyAction = searchText || hasActiveFilters 
    ? { 
        label: "Clear Filters", 
        onClick: () => {
          handleSearchChange("");
          handleFiltersChange({});
        }
      }
    : { 
        label: "Add First Clinic", 
        onClick: onAddClinic 
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
      <ListViewStats 
        stats={getStats()}
        isLoading={isLoading}
      />

      {/* Search and Controls */}
      <ListViewControls
        searchValue={searchText}
        onSearchChange={handleSearchChange}
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
        error={error ? "Failed to load clinics" : null}
        isEmpty={isEmpty}
        emptyMessage={emptyMessage}
        emptyAction={emptyAction}
        onRetry={handleRefresh}
        loadingSkeletonCount={6}
      >
        {data?.clinics.map((clinic) => (
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
        currentPage={data?.currentPage || currentPage}
        totalPages={data?.totalPages || 1}
        pageSize={pageSize}
        totalCount={data?.totalCount || 0}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        isLoading={isLoading}
      />
    </div>
  );
}