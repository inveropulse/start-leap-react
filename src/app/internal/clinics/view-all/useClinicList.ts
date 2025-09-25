import { useState, useMemo, useCallback } from "react";
import {
  ClinicSearchParams,
  useFindAllClinicsRequest,
} from "../../../../api/clinics";

export const useClinicList = () => {
  const [searchText, setSearchText] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<Partial<ClinicSearchParams>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [showFilters, setShowFilters] = useState(false);

  const searchParams = useMemo<ClinicSearchParams>(
    () => ({
      search: searchText || undefined,
      pageNo: currentPage,
      pageSize: pageSize,
      ...filters,
    }),
    [searchText, filters, currentPage, pageSize]
  );

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useFindAllClinicsRequest(searchParams);
  const data = response?.data;

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
  }, []);

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  const handleFiltersChange = useCallback(
    (newFilters: Partial<ClinicSearchParams>) => {
      setFilters(newFilters);
      setCurrentPage(1); // Reset to first page when filters change
    },
    []
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearchText(value);
    setCurrentPage(1); // Reset to first page when search changes
  }, []);

  const clearFiltersAndSearch = useCallback(() => {
    setSearchText("");
    setFilters({});
    setCurrentPage(1);
  }, []);

  const hasActiveFilters = Object.keys(filters).length > 0;
  const isEmpty = data && data?.length === 0;

  const emptyMessage = useMemo(() => {
    if (searchText || hasActiveFilters) {
      return "No clinics found matching your criteria";
    }
    return "No clinics registered yet";
  }, [searchText, hasActiveFilters]);

  return {
    // Data
    clinics: data || [],
    totalCount: response?.totalItems || 0,
    currentPage: response?.pageNo || currentPage,
    totalPages: response?.totalPages || 1,
    pageSize: response?.pageSize || pageSize,

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
    error: error ? "Failed to load clinics" : null,

    // Actions
    handleSearchChange,
    handleFiltersChange,
    handlePageChange,
    handlePageSizeChange,
    handleRefresh,
    toggleViewMode,
    toggleFilters,
    clearFiltersAndSearch,
  };
};
