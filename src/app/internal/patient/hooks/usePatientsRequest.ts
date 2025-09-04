import { useQuery } from "@tanstack/react-query";
import { patientService } from "../services/patientService";
import { PatientsQueryParams } from "../types/patient.types";

export const usePatientsRequest = (params: PatientsQueryParams = {}) => {
  return useQuery({
    queryKey: ["patients", params],
    queryFn: () => patientService.getPatients(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};