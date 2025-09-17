import { BooleanResponse } from "@/shared/types";
import { PATIENTS_REQUEST_BASE_QUERY_KEY } from "./types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosClient } from "@/shared/providers/AxiosClientProvider";

export const useDeletePatientRequest = () => {
  const { apiClient } = useAxiosClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...PATIENTS_REQUEST_BASE_QUERY_KEY, "delete"],
    mutationFn: deletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PATIENTS_REQUEST_BASE_QUERY_KEY,
      });
    },
  });
};

const deletePatient = async (id: string): Promise<BooleanResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Simulate patient not found error
  if (id === "nonexistent") {
    throw new Error("Patient not found");
  }

  // Mock successful deletion - in real implementation this would make HTTP DELETE request
  return {
    data: true,
    statusCode: 200,
    successful: true,
    message: "Patient deleted successfully",
  };
};
