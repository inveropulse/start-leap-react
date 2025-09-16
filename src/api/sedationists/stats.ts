import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/shared/types/shared-kernel/common";

export const SEDATIONIST_STATS_QUERY_KEY = "sedationistStats";

export interface SedationistStats {
  totalSedationists: number;
  activeSedationists: number;
  inactiveSedationists: number;
  onLeaveSedationists: number;
  inTrainingSedationists: number;
  averageSuccessRate: number;
  averagePatientRating: number;
  totalProcedures: number;
  averageProcedures: number;
}

type SedationistStatsResponse = ApiResponse<SedationistStats>;

// API function using mock data
async function fetchSedationistStats(): Promise<SedationistStatsResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const stats: SedationistStats = {
    totalSedationists: 4,
    activeSedationists: 2,
    inactiveSedationists: 0,
    onLeaveSedationists: 1,
    inTrainingSedationists: 1,
    averageSuccessRate: 98.9,
    averagePatientRating: 4.65,
    totalProcedures: 699,
    averageProcedures: 174.8,
  };

  return {
    successful: true,
    message: null,
    data: stats,
  };
}

// Hook
export function useSedationistStatsRequest() {
  return useQuery({
    queryKey: [SEDATIONIST_STATS_QUERY_KEY],
    queryFn: fetchSedationistStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
