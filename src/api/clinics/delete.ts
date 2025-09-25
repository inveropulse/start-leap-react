import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiBooleanResponse } from "../../shared/types/shared-kernel/common";
import { mockClinics } from "./findAll";

// Simulate network delay
const delay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// API function
const deleteClinic = async (id: string): Promise<ApiBooleanResponse> => {
  await delay();

  try {
    const index = mockClinics.findIndex((clinic) => clinic.id === id);

    if (index === -1) {
      return {
        successful: false,
        message: "Clinic not found",
        statusCode: 404,
      };
    }

    mockClinics.splice(index, 1);

    return {
      data: true,
      successful: true,
      message: "Clinic deleted successfully",
      statusCode: 200,
    };
  } catch (error) {
    return {
      successful: false,
      message:
        error instanceof Error ? error.message : "Failed to delete clinic",
      statusCode: 500,
    };
  }
};

// React Query mutation hook
export const useDeleteClinicRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClinic,
    onSuccess: (_, clinicId) => {
      // Invalidate clinic queries to refresh lists
      queryClient.invalidateQueries({ queryKey: ["clinics"] });
      // Remove the specific clinic from cache
      queryClient.removeQueries({
        queryKey: ["clinics", "findById", clinicId],
      });
    },
  });
};
