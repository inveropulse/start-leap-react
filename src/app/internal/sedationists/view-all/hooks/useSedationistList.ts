import { useState, useEffect } from "react";
import { useSedationistsRequest } from "@/api/sedationists";
import { SedationistSearchParams } from "@/shared/types/shared-kernel/filters";
import {
  Sedationist,
  SedationistStatus,
} from "@/shared/types/domains/sedationist";

export function useSedationistList() {
  // Search and pagination state
  const [searchParams, setSearchParams] = useState<SedationistSearchParams>({
    search: "",
    pageNo: 1,
    pageSize: 25,
  });

  // View mode state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // API call using new hook
  const { data, isLoading, error, refetch } =
    useSedationistsRequest(searchParams);

  // 1. Handle search change
  const handleSearchChange = (search: string) => {
    setSearchParams((prev) => ({
      ...prev,
      search,
      pageNo: 1, // Reset to first page on search
    }));
  };

  // 2. Handle page change
  const handlePageChange = (pageNo: number) => {
    setSearchParams((prev) => ({ ...prev, pageNo }));
  };

  // 3. Handle view mode toggle
  const handleViewModeToggle = () => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
  };

  // 4. Handle refresh
  const handleRefresh = () => {
    refetch();
  };

  // 5. Handle status filter
  const handleStatusFilter = (status: SedationistStatus[]) => {
    setSearchParams((prev) => ({ ...prev, status, pageNo: 1 }));
  };

  return {
    // Data
    sedationists: data?.data?.items || [],
    totalCount: data?.data?.totalPages || 0,
    totalPages: data?.data?.totalPages || 0,
    currentPage: data?.data?.page || 1,

    // State
    searchValue: searchParams.search || "",
    viewMode,
    isLoading,
    error,

    // Actions
    onSearchChange: handleSearchChange,
    onPageChange: handlePageChange,
    onViewModeToggle: handleViewModeToggle,
    onRefresh: handleRefresh,
    onStatusFilter: handleStatusFilter,
  };
}
