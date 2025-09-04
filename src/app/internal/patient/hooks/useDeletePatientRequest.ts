import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientService } from "../services/patientService";

export const useDeletePatientRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => patientService.deletePatient(id),
    onSuccess: (_, deletedPatientId) => {
      // Remove the specific patient from cache
      queryClient.removeQueries({ queryKey: ["patient", deletedPatientId] });
      
      // Invalidate patients list to refresh the data
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
    onError: (error) => {
      console.error("Failed to delete patient:", error);
    },
  });
};