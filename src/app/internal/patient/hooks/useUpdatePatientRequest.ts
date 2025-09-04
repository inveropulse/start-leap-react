import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientService } from "../services/patientService";
import { UpdatePatientRequest } from "../types/patient.types";

export const useUpdatePatientRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePatientRequest) => patientService.updatePatient(data),
    onSuccess: (updatedPatient) => {
      // Update the specific patient in cache
      queryClient.setQueryData(["patient", updatedPatient.id], updatedPatient);
      
      // Invalidate patients list to refresh the data
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
    onError: (error) => {
      console.error("Failed to update patient:", error);
    },
  });
};