import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/shared/providers/NotificationProvider";
import { usePatientsRequest } from "@/api/patients";
import { PatientSearchParams } from "@/shared/types";

export function usePatientList() {
  const navigate = useNavigate();
  const { showSuccess } = useNotifications();

  const [searchParams, setSearchParams] = useState<PatientSearchParams>({
    search: "",
    pageNo: 1,
    pageSize: 25,
  });

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deletePatientId, setDeletePatientId] = useState<string | null>(null);
  const [editPatientId, setEditPatientId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch, isFetching } =
    usePatientsRequest(searchParams);

  const handleSearchChange = useCallback((value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      search: value,
      pageNo: 1, // Reset to first page when searching
    }));
  }, []);

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
    viewMode,
    deletePatientId,
    editPatientId,

    // API data
    data,
    isLoading,
    isError,
    isFetching,

    // Actions
    handleSearchChange,
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
