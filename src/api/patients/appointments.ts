import { useQuery } from "@tanstack/react-query";
import { AppointmentStatus, PatientAppointment } from "@/shared/types";
import { PatientAppointmentsResponse } from "./types";
import { useAxiosClient } from "@/shared/providers/AxiosClientProvider";

export const usePatientAppointmentsRequest = (patientId: string) => {
  const { apiClient } = useAxiosClient();
  return useQuery({
    queryKey: ["patient-appointments", patientId],
    queryFn: () => fetchFakePatientAppointments(patientId),
    enabled: !!patientId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

const MOCK_PATIENT_APPOINTMENTS: Record<string, PatientAppointment[]> = {
  "patient-1": [
    // Past appointments
    {
      appointmentId: "appt-1",
      patientId: "patient-1",
      clinicId: "clinic-1",
      clinicName: "Downtown Medical Center",
      doctorId: "doc-1",
      sedationistId: "seda-1",
      doctorName: "Sarah Johnson",
      sedationistName: "Dr. Michael Chen",
      appointmentDateTime: "2024-01-15T10:00:00Z",
      appointmentDuration: 60,
      status: AppointmentStatus.COMPLETED,
      procedure: "Routine Dental Cleaning",
      notes: "Initial consultation completed successfully",
      estimatedCost: 150,
      reference: "REF-APT001",
    },
    {
      appointmentId: "appt-2",
      patientId: "patient-1",
      clinicId: "clinic-2",
      clinicName: "City Dental Practice",
      sedationistId: "seda-1",
      doctorId: "doc-2",
      doctorName: "Emma Williams",
      appointmentDateTime: "2024-06-10T14:30:00Z",
      appointmentDuration: 45,
      status: AppointmentStatus.COMPLETED,
      procedure: "Dental Checkup",
      notes: "Regular checkup - no issues found",
      estimatedCost: 120,
      reference: "REF-APT002",
    },
    // Upcoming appointments
    {
      appointmentId: "appt-3",
      patientId: "patient-1",
      clinicId: "clinic-1",
      clinicName: "Downtown Medical Center",
      doctorId: "doc-1",
      doctorName: "Sarah Johnson",
      sedationistName: "Dr. Michael Chen",
      sedationistId: "seda-1",
      appointmentDateTime: "2025-01-20T09:00:00Z",
      appointmentDuration: 90,
      status: AppointmentStatus.CONFIRMED,
      procedure: "Wisdom Tooth Extraction",
      notes: "Patient prefers morning appointments",
      estimatedCost: 350,
      reference: "REF-APT003",
    },
    {
      appointmentId: "appt-4",
      patientId: "patient-1",
      clinicId: "clinic-3",
      clinicName: "Westfield Surgery",
      doctorId: "doc-3",
      doctorName: "David Rodriguez",
      sedationistId: "seda-1",
      appointmentDateTime: "2025-02-15T11:30:00Z",
      appointmentDuration: 60,
      status: AppointmentStatus.PENDING,
      procedure: "Crown Preparation",
      estimatedCost: 280,
      reference: "REF-APT004",
    },
  ],
};

const fetchFakePatientAppointments = async (
  patientId: string
): Promise<PatientAppointmentsResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const allAppointments = MOCK_PATIENT_APPOINTMENTS[patientId] || [];
  const now = new Date();

  const upcoming = allAppointments
    .filter((apt) => new Date(apt.appointmentDateTime) > now)
    .sort(
      (a, b) =>
        new Date(a.appointmentDateTime).getTime() -
        new Date(b.appointmentDateTime).getTime()
    );

  const past = allAppointments
    .filter((apt) => new Date(apt.appointmentDateTime) <= now)
    .sort(
      (a, b) =>
        new Date(b.appointmentDateTime).getTime() -
        new Date(a.appointmentDateTime).getTime()
    );

  return {
    data: {
      upcoming,
      past,
    },
    statusCode: 200,
    successful: true,
    message: "Appointments fetched successfully",
  };
};
