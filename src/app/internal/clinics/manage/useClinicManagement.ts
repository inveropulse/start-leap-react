import { useCallback } from "react";
import {
  useClinicManagementDataRequest,
  useUpdateClinicRequest,
  useDeleteClinicRequest,
} from "../../../../api/clinics";
import { useToast } from "@/shared/hooks/use-toast";

interface UseClinicManagementOptions {
  clinicId?: string | null;
  onUpdate?: () => void;
  onDelete?: () => void;
}

export const useClinicManagement = ({
  clinicId,
  onUpdate,
  onDelete,
}: UseClinicManagementOptions) => {
  const { toast } = useToast();

  // Fetch management data
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useClinicManagementDataRequest(clinicId || undefined);

  const managementData = response?.data;

  // Update mutation
  const updateMutation = useUpdateClinicRequest();

  // Delete mutation
  const deleteMutation = useDeleteClinicRequest();

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleUpdate = useCallback(
    async (data: any) => {
      try {
        const response = await updateMutation.mutateAsync(data);
        if (response.successful) {
          toast({
            title: "Success",
            description: response.message || "Clinic updated successfully",
          });
          handleRefresh();
          onUpdate?.();
        } else {
          throw new Error(response.message || "Failed to update clinic");
        }
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to update clinic",
          variant: "destructive",
        });
        throw error;
      }
    },
    [updateMutation, toast, handleRefresh, onUpdate]
  );

  const handleDelete = useCallback(async () => {
    if (!clinicId) return;

    try {
      const response = await deleteMutation.mutateAsync(clinicId);
      if (response.successful) {
        toast({
          title: "Success",
          description: response.message || "Clinic deleted successfully",
        });
        onDelete?.();
      } else {
        throw new Error(response.message || "Failed to delete clinic");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete clinic",
        variant: "destructive",
      });
      throw error;
    }
  }, [clinicId, deleteMutation, toast, onDelete]);

  return {
    // Data
    managementData,
    clinic: managementData?.clinic,
    doctors: managementData?.doctors || [],
    users: managementData?.users || [],
    activities: managementData?.activities || [],

    // Loading states
    isLoading,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    error: error ? "Failed to load clinic data" : null,

    // Actions
    handleRefresh,
    handleUpdate,
    handleDelete,
  };
};
