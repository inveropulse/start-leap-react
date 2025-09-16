import { useMemo } from "react";
import { Building2, CheckCircle, MapPin, Users } from "lucide-react";
import { useClinicStatsRequest } from "../../../../api/clinics";
import { ListViewStat } from "../../shared";
import { ClinicStatus } from "../../../../shared/types/domains/clinic/enums";
import { Clinic } from "../../../../shared/types/domains/clinic/entities";

interface UseClinicListStatsProps {
  clinics: Clinic[];
  totalCount: number;
  isLoading: boolean;
}

export const useClinicListStats = ({
  clinics,
  totalCount,
  isLoading,
}: UseClinicListStatsProps) => {
  const { data: statsResponse } = useClinicStatsRequest();
  const stats = statsResponse?.data;

  const listStats = useMemo((): ListViewStat[] => {
    if (isLoading || !stats) {
      return [
        {
          id: "total",
          label: "Total Clinics",
          value: 0,
          icon: Building2,
          color: "default",
          tooltip: "Total number of clinics in the system",
        },
        {
          id: "active",
          label: "Active",
          value: 0,
          icon: CheckCircle,
          color: "success",
          tooltip: "Clinics currently active and operational",
        },
        {
          id: "types",
          label: "Types",
          value: 0,
          icon: Users,
          color: "primary",
          tooltip: "Different types of clinics",
        },
        {
          id: "cities",
          label: "Cities",
          value: 0,
          icon: MapPin,
          color: "default",
          tooltip: "Number of cities with clinics",
        },
      ];
    }

    // Calculate current page stats
    const activeCount = clinics.filter(
      (clinic) => clinic.status === ClinicStatus.ACTIVE
    ).length;
    const uniqueTypes = new Set(
      clinics.map((clinic) => clinic.type).filter(Boolean)
    ).size;
    const uniqueCities = new Set(
      clinics.map((clinic) => clinic.city).filter(Boolean)
    ).size;

    // Generate sample chart data based on clinic stats
    const generateTrendData = (count: number) => {
      return Array.from({ length: 7 }, (_, i) => ({
        value: Math.max(1, count - Math.floor(Math.random() * 10) + i),
        label: `Day ${i + 1}`,
      }));
    };

    return [
      {
        id: "total",
        label: "Total Clinics",
        value: stats.totalClinics,
        icon: Building2,
        color: "default",
        description: `${clinics.length} on this page`,
        tooltip: "Total number of clinics in the system",
        trend: {
          value: 8.2,
          type: "percentage" as const,
        },
        chart: {
          data: generateTrendData(stats.totalClinics),
          type: "line" as const,
        },
      },
      {
        id: "active",
        label: "Active Clinics",
        value: stats.activeClinics,
        icon: CheckCircle,
        color: "success",
        description: `${Math.round(
          (stats.activeClinics / stats.totalClinics) * 100
        )}% active`,
        tooltip: "Clinics currently active and operational",
        progress: {
          current: stats.activeClinics,
          target: stats.totalClinics,
          label: "Active Rate",
        },
        trend: {
          value: 5.3,
          type: "percentage" as const,
        },
      },
      {
        id: "types",
        label: "Clinic Types",
        value: uniqueTypes,
        icon: Users,
        color: "primary",
        description: "Different specializations",
        tooltip: "Number of different clinic types/specializations",
        chart: {
          data: generateTrendData(uniqueTypes),
          type: "bar" as const,
        },
      },
      {
        id: "cities",
        label: "Cities",
        value: uniqueCities,
        icon: MapPin,
        color: "default",
        description: "Geographic coverage",
        tooltip: "Number of cities with clinic presence",
        trend: {
          value: 2.1,
          type: "percentage" as const,
        },
      },
    ];
  }, [clinics, stats, isLoading, totalCount]);

  return listStats;
};
