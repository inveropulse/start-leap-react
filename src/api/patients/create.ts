import { patientsRequestBaseQueryKey } from ".";
import { CreatePatientRequest, Patient } from "@/shared/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosClient } from "@/shared/providers/AxiosClientProvider";
import { calculateAgeInYears, calculateBMI } from "@/app/internal/patients";

export type CreatePatientResponse = Patient;

export const useCreatePatientRequest = () => {
  const { apiClient } = useAxiosClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFakePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: patientsRequestBaseQueryKey });
    },
  });
};

const createFakePatient = async (
  data: CreatePatientRequest
): Promise<CreatePatientResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  const newPatient: CreatePatientResponse = {
    ...data,
    id: `patient-${Date.now()}`,
    fullName: `${data.firstName} ${data.lastName}`,
    age: calculateAgeInYears(data.dateOfBirth),
    bmi: calculateBMI(data.height, data.weight),
    createdDateTime: new Date().toISOString(),
  };

  return newPatient;
};
