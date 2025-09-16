import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateClinicRequest, ClinicApiResponse } from "./types";
import { mockClinics } from "./findAll";

// Simulate network delay
const delay = (ms: number = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// API function
const updateClinic = async (
  data: UpdateClinicRequest
): Promise<ClinicApiResponse> => {
  await delay();

  try {
    const index = mockClinics.findIndex((clinic) => clinic.id === data.id);

    if (index === -1) {
      return {
        successful: false,
        message: "Clinic not found",
        statusCode: 404,
      };
    }

    const updatedClinic = {
      ...mockClinics[index],
      ...data,
      lastUpdatedDateTime: new Date().toISOString(),
    };

    mockClinics[index] = updatedClinic;

    return {
      data: updatedClinic,
      successful: true,
      message: "Clinic updated successfully",
      statusCode: 200,
    };
  } catch (error) {
    return {
      successful: false,
      message:
        error instanceof Error ? error.message : "Failed to update clinic",
      statusCode: 500,
    };
  }
};

// React Query mutation hook
export const useUpdateClinicRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateClinic,
    onSuccess: (response) => {
      // Invalidate and update relevant queries
      queryClient.invalidateQueries({ queryKey: ["clinics"] });
      if (response.data?.id) {
        queryClient.setQueryData(
          ["clinics", "findById", response.data.id],
          response
        );
      }
    },
  });
};
