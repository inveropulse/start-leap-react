import { useQuery } from "@tanstack/react-query";
import { ClinicStats, ClinicStatsApiResponse } from "./types";
import { ClinicStatus } from "../../shared/types/domains/clinic/enums";
import { mockClinics } from "./findAll";

// Simulate network delay
const delay = (ms: number = 400) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// API function
const fetchClinicStats = async (): Promise<ClinicStatsApiResponse> => {
  await delay();

  try {
    const stats: ClinicStats = {
      totalClinics: mockClinics.length,
      activeClinics: mockClinics.filter((c) => c.status === ClinicStatus.ACTIVE)
        .length,
      inactiveClinics: mockClinics.filter(
        (c) => c.status === ClinicStatus.INACTIVE
      ).length,
      pendingClinics: mockClinics.filter(
        (c) => c.status === ClinicStatus.PENDING
      ).length,
      totalDoctors: mockClinics.reduce(
        (sum, clinic) => sum + (clinic.doctorCount || 0),
        0
      ),
      totalAppointments: mockClinics.reduce(
        (sum, clinic) => sum + (clinic.activeAppointmentCount || 0),
        0
      ),
    };

    return {
      data: stats,
      successful: true,
      message: null,
      statusCode: 200,
    };
  } catch (error) {
    return {
      successful: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch clinic statistics",
      statusCode: 500,
    };
  }
};

// React Query hook
export const useClinicStatsRequest = () => {
  return useQuery({
    queryKey: ["clinics", "stats"],
    queryFn: fetchClinicStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
