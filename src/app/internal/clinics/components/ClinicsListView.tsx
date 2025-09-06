import { useState, useMemo } from "react";
import { Search, Plus, RefreshCw, Grid3X3, List } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useClinicsRequest } from "../hooks/useClinicRequests";
import { ClinicSearchParams } from "../types/clinic.types";
import { ClinicCard } from "./ClinicCard";
import { ClinicFilters } from "./ClinicFilters";
import { ClinicPagination } from "./ClinicPagination";

interface ClinicsListViewProps {
  onAddClinic: () => void;
  onViewClinic: (id: string) => void;
}

export function ClinicsListView({ onAddClinic, onViewClinic }: ClinicsListViewProps) {
  const [searchText, setSearchText] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<Partial<ClinicSearchParams>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Clinics Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor all registered clinics
          </p>
        </div>
        <Button onClick={onAddClinic} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Clinic
        </Button>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clinics by name, location, or contact person..."
            value={searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleViewMode}
          >
            {viewMode === "grid" ? (
              <List className="h-4 w-4" />
            ) : (
              <Grid3X3 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <ClinicFilters 
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Stats - Always shown */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {isLoading ? (
            "Loading clinics..."
          ) : data ? (
            `Showing ${data.clinics.length} of ${data.totalCount} clinics`
          ) : (
            "No clinics loaded"
          )}
        </span>
        <span>
          {isLoading ? (
            "Page - of -"
          ) : data ? (
            `Page ${data.currentPage} of ${Math.max(1, data.totalPages)}`
          ) : (
            "Page 1 of 1"
          )}
        </span>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted rounded-lg h-48"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load clinics</p>
          <Button onClick={handleRefresh} variant="outline" className="mt-4">
            Try Again
          </Button>
        </div>
      )}

      {/* Clinics Grid/List */}
      {data && data.clinics.length > 0 && (
        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }>
          {data.clinics.map((clinic) => (
            <ClinicCard
              key={clinic.id}
              clinic={clinic}
              viewMode={viewMode}
              onView={() => onViewClinic(clinic.id!)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {data && data.clinics.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            {searchText || Object.keys(filters).length > 0 ? (
              <>
                <p>No clinics found matching your criteria</p>
                <Button 
                  onClick={() => {
                    handleSearchChange("");
                    handleFiltersChange({});
                  }} 
                  variant="outline" 
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </>
            ) : (
              <>
                <p>No clinics registered yet</p>
                <Button onClick={onAddClinic} className="mt-4">
                  Add First Clinic
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Always show pagination */}
      <ClinicPagination
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