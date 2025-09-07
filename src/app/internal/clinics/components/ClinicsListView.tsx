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
        { 
          id: 'total', 
          label: 'Total Clinics', 
          value: 0, 
          icon: Building2, 
          color: 'default',
          tooltip: 'Total number of clinics in the system'
        },
        { 
          id: 'active', 
          label: 'Active', 
          value: 0, 
          icon: CheckCircle, 
          color: 'success',
          tooltip: 'Clinics currently active and operational'
        },
        { 
          id: 'types', 
          label: 'Types', 
          value: 0, 
          icon: Users, 
          color: 'primary',
          tooltip: 'Different types of clinics'
        },
        { 
          id: 'cities', 
          label: 'Cities', 
          value: 0, 
          icon: MapPin, 
          color: 'default',
          tooltip: 'Number of cities with clinics'
        },
      ];
    }

    const activeCount = data.clinics.filter(clinic => clinic.status === ClinicStatus.ACTIVE).length;
    const uniqueTypes = new Set(data.clinics.map(clinic => clinic.type).filter(Boolean)).size;
    const uniqueCities = new Set(data.clinics.map(clinic => clinic.city).filter(Boolean)).size;
    
    // Generate sample chart data based on clinic stats
    const generateTrendData = (count: number) => {
      return Array.from({ length: 7 }, (_, i) => ({
        value: Math.max(1, count - Math.floor(Math.random() * 10) + i),
        label: `Day ${i + 1}`
      }));
    };

    return [
      { 
        id: 'total', 
        label: 'Total Clinics', 
        value: data.totalCount, 
        icon: Building2, 
        color: 'default',
        description: `${data.clinics.length} on this page`,
        tooltip: 'Total number of clinics in the system',
        trend: {
          value: 8.2,
          type: 'percentage' as const
        },
        chart: {
          data: generateTrendData(data.totalCount),
          type: 'line' as const
        }
      },
      { 
        id: 'active', 
        label: 'Active Clinics', 
        value: activeCount,
        icon: CheckCircle, 
        color: 'success',
        description: `${Math.round((activeCount / data.totalCount) * 100)}% active`,
        tooltip: 'Clinics currently active and operational',
        progress: {
          current: activeCount,
          target: data.totalCount,
          label: 'Active Rate'
        },
        trend: {
          value: 5.3,
          type: 'percentage' as const
        }
      },
      { 
        id: 'types', 
        label: 'Clinic Types', 
        value: uniqueTypes,
        icon: Users, 
        color: 'primary',
        description: 'Different specializations',
        tooltip: 'Number of different clinic types/specializations',
        chart: {
          data: generateTrendData(uniqueTypes),
          type: 'bar' as const
        }
      },
      { 
        id: 'cities', 
        label: 'Cities', 
        value: uniqueCities,
        icon: MapPin, 
        color: 'default',
        description: 'Geographic coverage',
        tooltip: 'Number of cities with clinic presence',
        trend: {
          value: 2.1,
          type: 'percentage' as const
        }
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