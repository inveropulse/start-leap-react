import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateClinicRequest, ClinicApiResponse } from "./types";
import { Clinic } from "../../shared/types/domains/clinic/entities";
import { ClinicStatus } from "../../shared/types/domains/clinic/enums";
import { mockClinics } from "./findAll";

// Simulate network delay
const delay = (ms: number = 1000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// API function
const createClinic = async (
  data: CreateClinicRequest
): Promise<ClinicApiResponse> => {
  await delay();

  try {
    const newClinic: Clinic = {
      ...data,
      id: `clinic-${Date.now()}`,
      doctorCount: 0,
      activeAppointmentCount: 0,
      status: data.status || ClinicStatus.ACTIVE,
      createdDateTime: new Date().toISOString(),
      lastUpdatedDateTime: new Date().toISOString(),
    };

    // Add to mock storage
    mockClinics.push(newClinic);

    return {
      data: newClinic,
      successful: true,
      message: "Clinic created successfully",
      statusCode: 201,
    };
  } catch (error) {
    return {
      successful: false,
      message:
        error instanceof Error ? error.message : "Failed to create clinic",
      statusCode: 500,
    };
  }
};

// React Query mutation hook
export const useCreateClinicRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClinic,
    onSuccess: () => {
      // Invalidate clinic queries to refresh lists
      queryClient.invalidateQueries({ queryKey: ["clinics"] });
    },
  });
};
