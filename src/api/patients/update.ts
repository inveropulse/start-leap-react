import {
  UpdatePatientRequest,
  UpdatePatientResponse,
  PATIENTS_REQUEST_BASE_QUERY_KEY,
} from "./types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosClient } from "@/shared/providers/AxiosClientProvider";
import { calculateAgeInYears, calculateBMI } from "@/app/internal/patients";

export const useUpdatePatientRequest = () => {
  const { apiClient } = useAxiosClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...PATIENTS_REQUEST_BASE_QUERY_KEY, "update"],
    mutationFn: updatePatient,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...PATIENTS_REQUEST_BASE_QUERY_KEY, variables.id],
      });
    },
  });
};

const updatePatient = async (
  data: UpdatePatientRequest
): Promise<UpdatePatientResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  if (!data.id) throw new Error("Patient ID is required");

  // Mock existing patient for update simulation
  const mockExistingPatient: UpdatePatientResponse["data"] = {
    id: data.id,
    firstName: "John",
    lastName: "Doe",
    fullName: "John Doe",
    age: 38,
    height: 180,
    weight: 75,
    createdDateTime: "2023-01-15T10:30:00Z",
  };

  const updatedPatient: UpdatePatientResponse["data"] = {
    ...mockExistingPatient,
    ...data,
    fullName: `${data.firstName || mockExistingPatient.firstName} ${
      data.lastName || mockExistingPatient.lastName
    }`,
    age: calculateAgeInYears(data.dateOfBirth) || mockExistingPatient.age,
    bmi: calculateBMI(data.height, data.weight) || mockExistingPatient.bmi,
  };

  return {
    data: updatedPatient,
    statusCode: 200,
    successful: true,
    message: "Patient updated successfully",
  };
};
