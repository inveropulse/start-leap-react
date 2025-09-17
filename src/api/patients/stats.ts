import { PatientStatsResponse } from "./types";
import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "@/shared/providers/AxiosClientProvider";

export const usePatientStatsRequest = () => {
  const { apiClient } = useAxiosClient();
  return useQuery({
    queryKey: ["patient-stats"],
    queryFn: fetchFakePatientStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

const MOCK_PATIENT_STATS: PatientStatsResponse["data"] = {
  total: 60,
  active: 55,
  inactive: 5,
  newThisMonth: 8,
  totalAppointments: 127,
  averageAge: 42,
};

const fetchFakePatientStats = async (): Promise<PatientStatsResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  return {
    data: MOCK_PATIENT_STATS,
    statusCode: 200,
    successful: true,
    message: "Patient stats fetched successfully",
  };
};
