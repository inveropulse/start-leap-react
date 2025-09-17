import {
  PatientSearchParams,
  FindAllPatientsResponse,
  PATIENTS_REQUEST_BASE_QUERY_KEY,
} from "./types";
import {
  Patient,
  SortOrder,
  PatientSex,
  PatientTitle,
  PatientAlcoholStatus,
  PatientSmokingStatus,
} from "@/shared/types";
import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "@/shared/providers/AxiosClientProvider";

const mockPatients = generateMockPatients();

export const useFindAllPatientsRequest = (params: PatientSearchParams) => {
  const { apiClient } = useAxiosClient();
  return useQuery({
    queryKey: [...PATIENTS_REQUEST_BASE_QUERY_KEY, params],
    queryFn: () => fetchPatients(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

const fetchPatients = async (
  params: PatientSearchParams
): Promise<FindAllPatientsResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filteredPatients = [...mockPatients];

  // Apply search filter
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredPatients = filteredPatients.filter(
      (patient) =>
        patient.firstName?.toLowerCase().includes(searchLower) ||
        patient.lastName?.toLowerCase().includes(searchLower) ||
        patient.fullName?.toLowerCase().includes(searchLower) ||
        patient.email?.toLowerCase().includes(searchLower) ||
        patient.phoneNumber?.includes(searchLower) ||
        patient.town?.toLowerCase().includes(searchLower)
    );
  }

  // Apply sorting
  if (params.sortBy) {
    filteredPatients.sort((a, b) => {
      const aValue = a[params.sortBy!];
      const bValue = b[params.sortBy!];

      if (!aValue && !bValue) return 0;
      if (!aValue) return 1;
      if (!bValue) return -1;

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return params.sortOrder === SortOrder.DESC ? -comparison : comparison;
    });
  }

  // Apply pagination
  const page = params.pageNo || 1;
  const pageSize = params.pageSize || 25;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedPatients = filteredPatients.slice(startIndex, endIndex);

  return {
    pageNo: page,
    pageSize: pageSize,
    data: paginatedPatients,
    totalItems: filteredPatients.length,
    totalPages: Math.ceil(filteredPatients.length / pageSize),
  };
};

function generateMockPatients(count: number = 60): Patient[] {
  const firstNames = [
    "James",
    "Mary",
    "Robert",
    "Patricia",
    "John",
    "Jennifer",
    "Michael",
    "Linda",
    "David",
    "Elizabeth",
    "William",
    "Barbara",
    "Richard",
    "Susan",
    "Joseph",
    "Jessica",
    "Thomas",
    "Sarah",
    "Christopher",
    "Karen",
    "Charles",
    "Nancy",
    "Daniel",
    "Lisa",
    "Matthew",
    "Betty",
    "Anthony",
    "Helen",
    "Mark",
    "Sandra",
    "Donald",
    "Donna",
    "Steven",
    "Carol",
    "Paul",
    "Ruth",
    "Andrew",
    "Sharon",
    "Joshua",
    "Michelle",
    "Kenneth",
    "Laura",
    "Kevin",
    "Sarah",
    "Brian",
    "Kimberly",
    "George",
    "Deborah",
    "Edward",
    "Dorothy",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Gonzalez",
    "Wilson",
    "Anderson",
    "Thomas",
    "Taylor",
    "Moore",
    "Jackson",
    "Martin",
    "Lee",
    "Perez",
    "Thompson",
    "White",
    "Harris",
    "Sanchez",
    "Clark",
    "Ramirez",
    "Lewis",
    "Robinson",
    "Walker",
    "Young",
    "Allen",
    "King",
    "Wright",
    "Scott",
    "Torres",
    "Nguyen",
    "Hill",
    "Flores",
  ];
  const titles = Object.values(PatientTitle);
  const sexes = Object.values(PatientSex);
  const smokingStatuses = Object.values(PatientSmokingStatus);
  const alcoholStatuses = Object.values(PatientAlcoholStatus);
  const towns = [
    "London",
    "Birmingham",
    "Manchester",
    "Leeds",
    "Glasgow",
    "Sheffield",
    "Liverpool",
    "Bristol",
    "Edinburgh",
    "Cardiff",
  ];
  const occupations = [
    "Teacher",
    "Engineer",
    "Doctor",
    "Nurse",
    "Manager",
    "Sales Representative",
    "Accountant",
    "Designer",
    "Developer",
    "Consultant",
    "Retired",
  ];

  return Array.from({ length: count }, (_, index) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const age = Math.floor(Math.random() * 80) + 18;
    const dateOfBirth = new Date();
    dateOfBirth.setFullYear(dateOfBirth.getFullYear() - age);

    return {
      id: `patient-${index + 1}`,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      title: titles[Math.floor(Math.random() * titles.length)],
      dateOfBirth: dateOfBirth.toISOString().split("T")[0],
      sex: sexes[Math.floor(Math.random() * sexes.length)],
      age,
      address: `${Math.floor(Math.random() * 999) + 1} ${
        [
          "High Street",
          "Church Lane",
          "Victoria Road",
          "Park Avenue",
          "Queens Road",
        ][Math.floor(Math.random() * 5)]
      }`,
      town: towns[Math.floor(Math.random() * towns.length)],
      country: "United Kingdom",
      postCode: `${
        ["SW", "NW", "SE", "NE", "E", "W"][Math.floor(Math.random() * 6)]
      }${Math.floor(Math.random() * 20) + 1} ${Math.floor(Math.random() * 9)}${
        ["A", "B", "C", "D", "E"][Math.floor(Math.random() * 5)]
      }${["A", "B", "C", "D", "E"][Math.floor(Math.random() * 5)]}`,
      phoneNumber: `+44 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      alternativePhoneNumber:
        Math.random() > 0.5
          ? `+44 ${Math.floor(Math.random() * 9000000000) + 1000000000}`
          : null,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      occupation: occupations[Math.floor(Math.random() * occupations.length)],
      height: Math.floor(Math.random() * 50) + 150,
      weight: Math.floor(Math.random() * 80) + 50,
      heightFormat: "cm",
      weightFormat: "kg",
      bmi: Math.round((Math.random() * 15 + 18.5) * 10) / 10,
      smokingStatus:
        smokingStatuses[Math.floor(Math.random() * smokingStatuses.length)],
      alcoholStatus:
        alcoholStatuses[Math.floor(Math.random() * alcoholStatuses.length)],
      asaClassification: Math.floor(Math.random() * 4) + 1,
      medicalHistory:
        Math.random() > 0.7
          ? "Hypertension, Diabetes Type 2"
          : Math.random() > 0.4
          ? "No significant medical history"
          : null,
      allergies:
        Math.random() > 0.8
          ? "Penicillin, Nuts"
          : Math.random() > 0.6
          ? "No known allergies"
          : null,
      medications:
        Math.random() > 0.6
          ? "Lisinopril 10mg daily, Metformin 500mg twice daily"
          : "None",
      anestheticHistory:
        Math.random() > 0.5
          ? "Previous general anesthesia for appendectomy - no complications"
          : "No previous anesthetic history",
      lastMealAgoInHours:
        Math.random() > 0.3 ? Math.floor(Math.random() * 12) + 8 : null,
      lastFluidAgoInHours:
        Math.random() > 0.3 ? Math.floor(Math.random() * 4) + 2 : null,
      notes:
        Math.random() > 0.7 ? "Patient prefers morning appointments" : null,
      smokingNote: Math.random() > 0.8 ? "1 pack per day for 15 years" : null,
      alcoholNote: Math.random() > 0.8 ? "2-3 units per week" : null,
      createdDateTime: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
      ).toISOString(),
    };
  });
}
