import { useMemo } from "react";
import { User, Activity, Calendar } from "lucide-react";
import { usePatientStatsRequest } from "@/api/patients/stats";
import type { FindAllPatientsResponse } from "@/api/patients/findAll";

export function usePatientListStats(data: FindAllPatientsResponse | undefined) {
  // Use the existing API hook for stats
  const { data: statsData, isLoading: isStatsLoading } =
    usePatientStatsRequest();

  const stats = useMemo(() => {
    if (!data || !statsData) return [];

    const total = data.totalCount;

    return [
      {
        id: "total",
        label: "Total Patients",
        value: statsData.total,
        icon: User,
        color: "default" as const,
        description: `${data.data.length} on this page`,
        tooltip: "Total number of patients in the system",
        trend: {
          value: 12.5, // This could come from API in the future
          type: "percentage" as const,
        },
      },
      {
        id: "active",
        label: "Active Patients",
        value: statsData.active,
        icon: Activity,
        color: "success" as const,
        description: "Currently in care",
        tooltip: "Patients who are actively receiving care",
        progress: {
          current: statsData.active,
          target: statsData.total,
          label: "Activity Rate",
        },
        trend: {
          value: 8.3, // This could come from API in the future
          type: "percentage" as const,
        },
      },
      {
        id: "recent",
        label: "New This Month",
        value: statsData.newThisMonth,
        icon: Calendar,
        color: "primary" as const,
        description: "New patients",
        tooltip: "Patients added this month",
        chart: {
          data: Array.from({ length: 6 }, (_, i) => ({
            value: Math.floor(Math.random() * 20) + 5, // Mock data - could come from API
            label: `Week ${i + 1}`,
          })),
          type: "bar" as const,
        },
      },
      {
        id: "demographics",
        label: "Demographics",
        value: `${statsData.averageAge}y`,
        icon: User,
        color: "default" as const,
        description: "Average age",
        tooltip: "Average age of all patients",
        trend: {
          value: 1.2, // This could come from API in the future
          type: "percentage" as const,
        },
      },
    ];
  }, [data, statsData]);

  return { stats, isStatsLoading };
}
