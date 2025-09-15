import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/shared/providers/NotificationProvider";
import { usePatientsRequest } from "@/api/patients";
import { PatientSearchParams } from "@/shared/types";

interface UsePatientListConfig {
  enableSearchButton?: boolean;
  searchMinLength?: number;
}

export function usePatientList(config?: UsePatientListConfig) {
  const { enableSearchButton = false, searchMinLength = 3 } = config || {};

  const navigate = useNavigate();
  const { showSuccess } = useNotifications();

  const [searchParams, setSearchParams] = useState<PatientSearchParams>({
    search: "",
    pageNo: 1,
    pageSize: 25,
  });

  const [pendingSearch, setPendingSearch] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deletePatientId, setDeletePatientId] = useState<string | null>(null);
  const [editPatientId, setEditPatientId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch, isFetching } =
    usePatientsRequest(searchParams);

  const handleSearchChange = useCallback(
    (value: string) => {
      if (enableSearchButton) {
        // When search button is enabled, store the search term but don't execute the search
        setPendingSearch(value);
        setSearchParams((prev) => ({
          ...prev,
          search: "",
          pageNo: 1,
        }));
      } else {
        // Auto-search mode (existing behavior)
        if (value.length >= searchMinLength) {
          setSearchParams((prev) => ({
            ...prev,
            search: value,
            pageNo: 1, // Reset to first page when searching
          }));
        }
      }
    },
    [enableSearchButton]
  );

  const handleSearchButtonClick = useCallback(() => {
    if (pendingSearch == "") {
      setSearchParams((prev) => ({
        ...prev,
        search: "",
        pageNo: 1,
      }));
    } else if (pendingSearch.length >= searchMinLength) {
      setSearchParams((prev) => ({
        ...prev,
        search: pendingSearch,
        pageNo: 1,
      }));
    }
  }, [pendingSearch, searchMinLength]);

  const handleSearchKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && enableSearchButton) {
        event.preventDefault();
        handleSearchButtonClick();
      }
    },
    [enableSearchButton, handleSearchButtonClick]
  );

  const handlePageChange = useCallback((page: number) => {
    setSearchParams((prev) => ({ ...prev, pageNo: page }));
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setSearchParams((prev) => ({
      ...prev,
      pageSize,
      pageNo: 1, // Reset to first page when changing page size
    }));
  }, []);

  const handleRefresh = useCallback(async () => {
    await refetch();
    showSuccess("Patient list refreshed");
  }, [refetch, showSuccess]);

  const handlePatientView = useCallback(
    (patientId: string) => {
      navigate(`/internal/patients/${patientId}`);
    },
    [navigate]
  );

  const handlePatientEdit = useCallback((patientId: string) => {
    setEditPatientId(patientId);
  }, []);

  const handlePatientDelete = useCallback((patientId: string) => {
    setDeletePatientId(patientId);
  }, []);

  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
  }, []);

  return {
    // State
    searchParams,
    pendingSearch,
    viewMode,
    deletePatientId,
    editPatientId,

    // Configuration
    enableSearchButton,
    searchMinLength,

    // API data
    data,
    isLoading,
    isError,
    isFetching,

    // Actions
    handleSearchChange,
    handleSearchButtonClick,
    handleSearchKeyDown,
    handlePageChange,
    handlePageSizeChange,
    handleRefresh,
    handlePatientView,
    handlePatientEdit,
    handlePatientDelete,
    toggleViewMode,

    // Modal controls
    setDeletePatientId,
    setEditPatientId,
  };
}
