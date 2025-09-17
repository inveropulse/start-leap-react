import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "@/shared/types/shared-kernel/common";
import {
  Sedationist,
  CreateSedationistData,
  SedationistStatus,
} from "@/shared/types/domains/sedationist";
import {
  SEDATIONISTS_QUERY_KEY,
  getSedationistsData,
  setSedationistsData,
} from "./findAll";

export type CreateSedationistResponse = ApiResponse<Sedationist>;

// API function with inline mock logic
async function createSedationist(
  data: CreateSedationistData
): Promise<CreateSedationistResponse> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    const newSedationist: Sedationist = {
      id: Math.random().toString(36).substr(2, 9),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      licenseNumber: data.licenseNumber,
      status: SedationistStatus.ACTIVE,
      specialties: data.specialties || (data.specialty ? [data.specialty] : []),
      certifications: data.certifications || [],
      availability: [],
      recentCases: [],
      joinDate: new Date().toISOString().split("T")[0],
      totalProcedures: 0,
      successRate: 0,
      patientRating: 0,
      experience: data.experience || 0,
      yearsOfExperience: data.experience || 0,
      rating: 0,
      currentCaseload: 0,
    };

    const currentSedationists = getSedationistsData();
    setSedationistsData([...currentSedationists, newSedationist]);

    return {
      successful: true,
      message: "Sedationist created successfully",
      data: newSedationist,
    };
  } catch (error) {
    return {
      successful: false,
      message:
        error instanceof Error ? error.message : "Failed to create sedationist",
      data: undefined,
    };
  }
}

// Hook
export function useCreateSedationistRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSedationist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SEDATIONISTS_QUERY_KEY] });
    },
  });
}
