import { useQuery } from "@tanstack/react-query";
import { ClinicApiResponse } from "./types";
import { Clinic } from "../../shared/types/domains/clinic/entities";

// Import mock data from findAll.ts
import { mockClinics } from "./findAll";

// Simulate network delay
const delay = (ms: number = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// API function
const fetchClinicById = async (id: string): Promise<ClinicApiResponse> => {
  await delay();

  try {
    const clinic = mockClinics.find((clinic) => clinic.id === id);

    if (!clinic) {
      return {
        successful: false,
        message: "Clinic not found",
        statusCode: 404,
      };
    }

    return {
      data: clinic,
      successful: true,
      message: null,
      statusCode: 200,
    };
  } catch (error) {
    return {
      successful: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch clinic",
      statusCode: 500,
    };
  }
};

// React Query hook
export const useFindClinicByIdRequest = (id: string | undefined) => {
  return useQuery({
    queryKey: ["clinics", "findById", id],
    queryFn: () => fetchClinicById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
