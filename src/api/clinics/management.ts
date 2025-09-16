import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "../../shared/types/shared-kernel/common";
import {
  ClinicManagementData,
  ClinicDoctor,
  ClinicUser,
  ClinicActivity,
} from "../../shared/types/domains/clinic/entities";
import { mockClinics } from "./findAll";

// Mock data generators for management data
const generateMockDoctors = (
  clinicId: string,
  count: number = 5
): ClinicDoctor[] => {
  const firstNames = [
    "John",
    "Sarah",
    "Michael",
    "Emma",
    "David",
    "Lisa",
    "James",
    "Emily",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Brown",
    "Davis",
    "Wilson",
    "Thompson",
    "Anderson",
    "White",
  ];
  const specializations = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Dermatology",
    "General Practice",
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `${clinicId}-doctor-${i}`,
    firstName: firstNames[i % firstNames.length],
    lastName: lastNames[i % lastNames.length],
    specialization: specializations[i % specializations.length],
    phoneNumber: `+44 ${Math.floor(Math.random() * 9000) + 1000} ${
      Math.floor(Math.random() * 900) + 100
    } ${Math.floor(Math.random() * 900) + 100}`,
    email: `${firstNames[i % firstNames.length].toLowerCase()}.${lastNames[
      i % lastNames.length
    ].toLowerCase()}@clinic.com`,
    status: Math.random() > 0.2 ? "Active" : ("Inactive" as const),
    joinedDate: new Date(
      Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000
    ).toISOString(),
  }));
};

const generateMockUsers = (
  clinicId: string,
  count: number = 3
): ClinicUser[] => {
  const firstNames = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank"];
  const lastNames = ["Brown", "Green", "White", "Black", "Gray", "Blue"];
  const roles = ["Admin", "Receptionist", "Nurse", "Manager"];

  return Array.from({ length: count }, (_, i) => ({
    id: `${clinicId}-user-${i}`,
    firstName: firstNames[i % firstNames.length],
    lastName: lastNames[i % lastNames.length],
    email: `${firstNames[i % firstNames.length].toLowerCase()}.${lastNames[
      i % lastNames.length
    ].toLowerCase()}@clinic.com`,
    role: roles[i % roles.length],
    status: Math.random() > 0.1 ? "Active" : ("Inactive" as const),
    lastLogin:
      Math.random() > 0.3
        ? new Date(
            Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
          ).toISOString()
        : undefined,
  }));
};

const generateMockActivities = (
  clinicId: string,
  count: number = 15
): ClinicActivity[] => {
  const types: ClinicActivity["type"][] = [
    "Created",
    "Updated",
    "Doctor Added",
    "Doctor Removed",
    "Status Changed",
  ];
  const performers = ["John Admin", "Sarah Manager", "System", "Michael Brown"];

  return Array.from({ length: count }, (_, i) => ({
    id: `${clinicId}-activity-${i}`,
    type: types[i % types.length],
    description: `Clinic ${types[i % types.length].toLowerCase()} by ${
      performers[i % performers.length]
    }`,
    performedBy: performers[i % performers.length],
    timestamp: new Date(
      Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000
    ).toISOString(),
    details: { action: types[i % types.length], reason: "Routine maintenance" },
  }));
};

// Simulate network delay
const delay = (ms: number = 600) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// API function
const fetchClinicManagementData = async (
  id: string
): Promise<ApiResponse<ClinicManagementData>> => {
  await delay();

  try {
    const clinic = mockClinics.find((c) => c.id === id);

    if (!clinic) {
      return {
        successful: false,
        message: "Clinic not found",
        statusCode: 404,
      };
    }

    const managementData: ClinicManagementData = {
      clinic,
      doctors: generateMockDoctors(id, clinic.doctorCount || 5),
      users: generateMockUsers(id, 3),
      activities: generateMockActivities(id, 15),
    };

    return {
      data: managementData,
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
          : "Failed to fetch clinic management data",
      statusCode: 500,
    };
  }
};

// React Query hook
export const useClinicManagementDataRequest = (id: string | undefined) => {
  return useQuery({
    queryKey: ["clinics", "managementData", id],
    queryFn: () => fetchClinicManagementData(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
