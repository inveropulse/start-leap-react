import { useQuery } from "@tanstack/react-query";
import {
  ClinicSearchParams,
  ClinicPaginationResponse,
  ClinicListApiResponse,
} from "./types";
import { Clinic } from "../../shared/types/domains/clinic/entities";
import {
  ClinicStatus,
  ClinicType,
} from "../../shared/types/domains/clinic/enums";

// Mock data generation functions (moved from clinicService.ts)
const generateMockClinic = (id: number): Clinic => {
  const clinicNames = [
    "London Medical Centre",
    "Brighton Health Clinic",
    "Manchester Specialist Centre",
    "Birmingham Family Practice",
    "Leeds Dental Surgery",
    "Liverpool Medical Hub",
    "Sheffield Health Centre",
    "Bristol General Practice",
    "Cardiff Medical Centre",
    "Edinburgh Clinic",
    "Glasgow Health Practice",
    "Newcastle Medical Centre",
    "Oxford Health Clinic",
    "Cambridge Medical Practice",
    "Canterbury Dental Centre",
  ];

  const contactPersons = [
    "Dr. Sarah Johnson",
    "Dr. Michael Brown",
    "Dr. Emily Davis",
    "Dr. James Wilson",
    "Dr. Emma Thompson",
    "Dr. Robert Anderson",
    "Dr. Lisa White",
    "Dr. David Clark",
  ];

  const addresses = [
    "123 Harley Street, London",
    "45 Marine Parade, Brighton",
    "78 Oxford Road, Manchester",
    "156 High Street, Birmingham",
    "234 Woodhouse Lane, Leeds",
    "89 Bold Street, Liverpool",
    "67 Division Street, Sheffield",
    "145 Park Street, Bristol",
    "89 Queen Street, Cardiff",
    "234 Royal Mile, Edinburgh",
    "123 Sauchiehall Street, Glasgow",
    "67 Grey Street, Newcastle",
  ];

  const cities = [
    "London",
    "Brighton",
    "Manchester",
    "Birmingham",
    "Leeds",
    "Liverpool",
    "Sheffield",
    "Bristol",
    "Cardiff",
    "Edinburgh",
    "Glasgow",
    "Newcastle",
  ];

  const statuses = Object.values(ClinicStatus);
  const types = Object.values(ClinicType);

  return {
    id: `clinic-${id}`,
    name: clinicNames[id % clinicNames.length],
    contactPersonName: contactPersons[id % contactPersons.length],
    physicalAddress: addresses[id % addresses.length],
    phoneNumber: `+44 ${Math.floor(Math.random() * 9000) + 1000} ${
      Math.floor(Math.random() * 900) + 100
    } ${Math.floor(Math.random() * 900) + 100}`,
    postalCode: `${String.fromCharCode(
      65 + Math.floor(Math.random() * 26)
    )}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(
      Math.random() * 10
    )} ${Math.floor(Math.random() * 10)}${String.fromCharCode(
      65 + Math.floor(Math.random() * 26)
    )}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
    website: `https://www.${clinicNames[id % clinicNames.length]
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^\w]/g, "")}.co.uk`,
    emailAddress: `info@${clinicNames[id % clinicNames.length]
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^\w]/g, "")}.co.uk`,
    comments:
      Math.random() > 0.7
        ? "Specialized in emergency care and diagnostics"
        : null,
    status: statuses[id % statuses.length],
    type: types[id % types.length],
    city: cities[id % cities.length],
    country: "United Kingdom",
    doctorCount: Math.floor(Math.random() * 15) + 2,
    activeAppointmentCount: Math.floor(Math.random() * 50) + 5,
    createdDateTime: new Date(
      Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
    ).toISOString(),
    lastUpdatedDateTime: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
  };
};

const generateMockClinics = (count: number = 60): Clinic[] => {
  return Array.from({ length: count }, (_, i) => generateMockClinic(i));
};

// Mock storage
export const mockClinics = generateMockClinics(60);

// Simulate network delay
const delay = (ms: number = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// API function
const fetchClinics = async (
  params: ClinicSearchParams = {}
): Promise<ClinicListApiResponse> => {
  await delay();

  try {
    let filteredClinics = [...mockClinics];

    // Apply search filter
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredClinics = filteredClinics.filter(
        (clinic) =>
          clinic.name?.toLowerCase().includes(searchLower) ||
          clinic.contactPersonName?.toLowerCase().includes(searchLower) ||
          clinic.physicalAddress?.toLowerCase().includes(searchLower) ||
          clinic.city?.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (params.status) {
      filteredClinics = filteredClinics.filter(
        (clinic) => clinic.status === params.status
      );
    }

    // Apply type filter
    if (params.type) {
      filteredClinics = filteredClinics.filter(
        (clinic) => clinic.type === params.type
      );
    }

    // Apply city filter
    if (params.city) {
      filteredClinics = filteredClinics.filter(
        (clinic) => clinic.city === params.city
      );
    }

    // Apply sorting
    if (params.sortBy) {
      filteredClinics.sort((a, b) => {
        const aVal = (a as any)[params.sortBy!] ?? "";
        const bVal = (b as any)[params.sortBy!] ?? "";
        const result = aVal.toString().localeCompare(bVal.toString());
        return params.sortOrder === "desc" ? -result : result;
      });
    }

    // Apply pagination
    const pageNo = params.pageNo || 1;
    const pageSize = params.pageSize || 12;
    const startIndex = (pageNo - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedClinics = filteredClinics.slice(startIndex, endIndex);

    const paginationResponse: ClinicPaginationResponse = {
      items: paginatedClinics,
      totalCount: filteredClinics.length,
      totalPages: Math.ceil(filteredClinics.length / pageSize),
      pageNo,
      pageSize,
    };

    return {
      data: paginationResponse,
      successful: true,
      message: null,
      statusCode: 200,
    };
  } catch (error) {
    return {
      successful: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch clinics",
      statusCode: 500,
    };
  }
};

// React Query hook
export const useFindAllClinicsRequest = (params: ClinicSearchParams = {}) => {
  return useQuery({
    queryKey: ["clinics", "findAll", params],
    queryFn: () => fetchClinics(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
