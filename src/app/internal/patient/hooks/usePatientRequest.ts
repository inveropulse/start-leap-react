import { useQuery } from "@tanstack/react-query";
import { patientService } from "../services/patientService";

export const usePatientRequest = (id: string) => {
  return useQuery({
    queryKey: ["patient", id],
    queryFn: () => patientService.getPatient(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};