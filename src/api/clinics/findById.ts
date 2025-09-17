import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "@/shared/providers/AxiosClientProvider";
import {
  FindByIdClinicResponse,
  ClinicWithAppointmentsResponse,
  CLINICS_REQUEST_BASE_QUERY_KEY,
} from "./types";
import type {
  Clinic,
  ClinicAppointment,
} from "@/shared/types/domains/clinic/entities";
import {
  ClinicType,
  ClinicStatus,
  MedicalSpecialty,
} from "@/shared/types/domains/clinic/enums";

export const useFindByIdClinicRequest = (clinicId: string) => {
  const { apiClient } = useAxiosClient();
  return useQuery({
    queryKey: [...CLINICS_REQUEST_BASE_QUERY_KEY, clinicId],
    queryFn: () => fetchFakeClinic(clinicId),
    enabled: !!clinicId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Enhanced hook that includes appointments
export const useFindClinicWithAppointmentsRequest = (clinicId: string) => {
  const { apiClient } = useAxiosClient();
  return useQuery({
    queryKey: [
      ...CLINICS_REQUEST_BASE_QUERY_KEY,
      clinicId,
      "with-appointments",
    ],
    queryFn: () => fetchFakeClinicWithAppointments(clinicId),
    enabled: !!clinicId,
    staleTime: 5 * 60 * 1000,
  });
};

const fetchFakeClinic = async (id: string): Promise<FindByIdClinicResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const mockClinic: Clinic = {
    id,
    name: "Downtown Medical Clinic",
    status: ClinicStatus.ACTIVE,
    address: "123 Medical Plaza",
    town: "London",
    country: "United Kingdom",
    postCode: "SW1A 1AA",
    phoneNumber: "+44 20 1234 5678",
    email: "admin@downtownclinic.co.uk",
    contactPersonName: "Dr. Jane Smith",
    contactPersonEmail: "jane.smith@downtownclinic.co.uk",
    contactPersonPhone: "+44 20 1234 9999",
    operatingHours: {
      monday: "9:00 AM - 5:00 PM",
      tuesday: "9:00 AM - 5:00 PM",
      wednesday: "9:00 AM - 5:00 PM",
      thursday: "9:00 AM - 5:00 PM",
      friday: "9:00 AM - 4:00 PM",
      saturday: "10:00 AM - 2:00 PM",
      sunday: "Closed",
    },
    specialties: [
      MedicalSpecialty.INTERNAL_MEDICINE,
      MedicalSpecialty.CARDIOLOGY,
    ],
    type: ClinicType.HOSPITAL,
    accreditations: ["CQC Registered", "NHS Foundation Trust"],
    notes: "Leading healthcare provider in the downtown area",
    totalPatients: 150,
    totalAppointments: 300,
    activeAppointmentsCount: 25,
    lastActivityDate: "2024-01-15T12:30:00Z",
    createdDateTime: "2023-01-10T08:00:00Z",
    updatedDateTime: "2024-01-15T12:30:00Z",
  };

  return {
    data: mockClinic,
    message: "Clinic fetched successfully",
    successful: true,
    statusCode: 200,
  };
};

const fetchFakeClinicWithAppointments = async (
  id: string
): Promise<ClinicWithAppointmentsResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const clinic: Clinic = {
    id,
    name: "Downtown Medical Clinic",
    status: ClinicStatus.ACTIVE,
    address: "123 Medical Plaza",
    town: "London",
    country: "United Kingdom",
    phoneNumber: "+44 20 1234 5678",
    email: "admin@downtownclinic.co.uk",
    createdDateTime: new Date().toISOString(),
  };

  // ClinicAppointment relations - used within this response
  const appointments: ClinicAppointment[] = [
    {
      clinicId: id,
      appointmentId: "apt-001",
      clinicName: "Downtown Medical Clinic",
      clinicAddress: "123 Medical Plaza, London",
      clinicPhoneNumber: "+44 20 1234 5678",
      appointmentDateTime: "2024-09-25T10:00:00Z",
      appointmentStatus: "confirmed",
      procedureType: "Sedation",
      patientFullName: "John Doe",
      patientEmail: "john.doe@example.com",
      sedationistName: "Dr. Smith",
      assignedDate: "2024-09-15T14:30:00Z",
      status: "confirmed",
    },
  ];

  return {
    data: {
      clinic,
      appointments,
    },
    successful: true,
    statusCode: 200,
  };
};
