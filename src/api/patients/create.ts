import {
  CreatePatientRequest,
  CreatePatientResponse,
  PATIENTS_REQUEST_BASE_QUERY_KEY,
} from "./types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosClient } from "@/shared/providers/AxiosClientProvider";
import { calculateAgeInYears, calculateBMI } from "@/app/internal/patients";

export const useCreatePatientRequest = () => {
  const { apiClient } = useAxiosClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...PATIENTS_REQUEST_BASE_QUERY_KEY, "create"],
    mutationFn: createFakePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PATIENTS_REQUEST_BASE_QUERY_KEY,
      });
    },
  });
};

const createFakePatient = async (
  data: CreatePatientRequest
): Promise<CreatePatientResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const newPatient: CreatePatientResponse["data"] = {
    ...data,
    id: `patient-${Date.now()}`,
    fullName: `${data.firstName} ${data.lastName}`,
    age: calculateAgeInYears(data.dateOfBirth),
    bmi: calculateBMI(data.height, data.weight),
    createdDateTime: new Date().toISOString(),
  };

  return {
    data: newPatient,
    statusCode: 201,
    successful: true,
    message: "Patient created successfully",
  };
};
