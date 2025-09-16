import { useSedationistStatsRequest } from "@/api/sedationists";

export function useSedationistListStats() {
  const { data: response, isLoading, error } = useSedationistStatsRequest();

  const stats = response?.data;

  return {
    // Formatted stats for UI
    totalSedationists: stats?.totalSedationists || 0,
    activeSedationists: stats?.activeSedationists || 0,
    inactiveSedationists: stats?.inactiveSedationists || 0,
    onLeaveSedationists: stats?.onLeaveSedationists || 0,
    inTrainingSedationists: stats?.inTrainingSedationists || 0,
    averageSuccessRate: stats?.averageSuccessRate || 0,
    averagePatientRating: stats?.averagePatientRating || 0,
    totalProcedures: stats?.totalProcedures || 0,
    averageProcedures: stats?.averageProcedures || 0,

    // State
    isLoading,
    error,
  };
}
