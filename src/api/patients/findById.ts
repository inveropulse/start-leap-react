import {
  Patient,
  PatientSex,
  ApiResponse,
  PatientTitle,
  PatientAlcoholStatus,
  PatientSmokingStatus,
} from "@/shared/types";
import { patientsRequestBaseQueryKey } from ".";
import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "@/shared/providers/AxiosClientProvider";

export const usePatientRequest = (id: string) => {
  const { apiClient } = useAxiosClient();
  return useQuery({
    queryKey: [...patientsRequestBaseQueryKey, id],
    queryFn: () => fetchPatient(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

const fetchPatient = async (
  id: string
): Promise<ApiResponse<Patient> | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const mockPatient: Patient = {
    id: id,
    firstName: "John",
    lastName: "Doe",
    fullName: "John Doe",
    title: PatientTitle.MR,
    dateOfBirth: "1985-03-15",
    sex: PatientSex.MALE,
    age: 38,
    address: "123 High Street",
    town: "London",
    country: "United Kingdom",
    postCode: "SW1 2AB",
    phoneNumber: "+44 1234567890",
    alternativePhoneNumber: "+44 9876543210",
    email: "john.doe@email.com",
    occupation: "Engineer",
    height: 180,
    weight: 75,
    heightFormat: "cm",
    weightFormat: "kg",
    bmi: 23.1,
    smokingStatus: PatientSmokingStatus.NEVER,
    alcoholStatus: PatientAlcoholStatus.FORMER,
    asaClassification: 1,
    medicalHistory: "No significant medical history",
    allergies: "No known allergies",
    medications: "None",
    anestheticHistory: "No previous anesthetic history",
    lastMealAgoInHours: 10,
    lastFluidAgoInHours: 3,
    notes: null,
    smokingNote: null,
    alcoholNote: null,
    createdDateTime: "2023-01-15T10:30:00Z",
  };

  return {
    data: mockPatient,
    message: "Patient fetched successfully",
    successful: true,
    statusCode: 200,
  };
};
