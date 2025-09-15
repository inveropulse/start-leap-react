import { useQuery } from "@tanstack/react-query";
import { useAxiosClient } from "@/shared/providers/AxiosClientProvider";

export interface PatientAppointment {
  id: string;
  patientId: string;
  dateTime: string; // Changed from scheduledAt to match component expectations
  duration: number; // in minutes
  status: "confirmed" | "pending" | "completed" | "cancelled" | "no-show";
  doctorName: string;
  doctorId: string;
  clinicName: string;
  clinicId: string;
  procedure?: string;
  sedationistName?: string;
  notes?: string;
  fee?: number;
  reference?: string;
}

export interface PatientAppointmentsResponse {
  upcoming: PatientAppointment[];
  past: PatientAppointment[];
}

export const usePatientAppointmentsRequest = (patientId: string) => {
  const { apiClient } = useAxiosClient();
  return useQuery({
    queryKey: ["patient-appointments", patientId],
    queryFn: () => fetchPatientAppointments(patientId),
    enabled: !!patientId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

const MOCK_PATIENT_APPOINTMENTS: Record<string, PatientAppointment[]> = {
  "patient-1": [
    // Past appointments
    {
      id: "appt-1",
      patientId: "patient-1",
      clinicId: "clinic-1",
      clinicName: "Downtown Medical Center",
      doctorId: "doc-1",
      doctorName: "Sarah Johnson",
      sedationistName: "Dr. Michael Chen",
      dateTime: "2024-01-15T10:00:00Z",
      duration: 60,
      status: "completed",
      procedure: "Routine Dental Cleaning",
      notes: "Initial consultation completed successfully",
      fee: 150,
      reference: "REF-APT001",
    },
    {
      id: "appt-2",
      patientId: "patient-1",
      clinicId: "clinic-2",
      clinicName: "City Dental Practice",
      doctorId: "doc-2",
      doctorName: "Emma Williams",
      dateTime: "2024-06-10T14:30:00Z",
      duration: 45,
      status: "completed",
      procedure: "Dental Checkup",
      notes: "Regular checkup - no issues found",
      fee: 120,
      reference: "REF-APT002",
    },
    // Upcoming appointments
    {
      id: "appt-3",
      patientId: "patient-1",
      clinicId: "clinic-1",
      clinicName: "Downtown Medical Center",
      doctorId: "doc-1",
      doctorName: "Sarah Johnson",
      sedationistName: "Dr. Michael Chen",
      dateTime: "2025-01-20T09:00:00Z",
      duration: 90,
      status: "confirmed",
      procedure: "Wisdom Tooth Extraction",
      notes: "Patient prefers morning appointments",
      fee: 350,
      reference: "REF-APT003",
    },
    {
      id: "appt-4",
      patientId: "patient-1",
      clinicId: "clinic-3",
      clinicName: "Westfield Surgery",
      doctorId: "doc-3",
      doctorName: "David Rodriguez",
      dateTime: "2025-02-15T11:30:00Z",
      duration: 60,
      status: "pending",
      procedure: "Crown Preparation",
      fee: 280,
      reference: "REF-APT004",
    },
  ],
};

const fetchPatientAppointments = async (
  patientId: string
): Promise<PatientAppointmentsResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const allAppointments = MOCK_PATIENT_APPOINTMENTS[patientId] || [];
  const now = new Date();

  const upcoming = allAppointments
    .filter((apt) => new Date(apt.dateTime) > now)
    .sort(
      (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
    );

  const past = allAppointments
    .filter((apt) => new Date(apt.dateTime) <= now)
    .sort(
      (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
    );

  return {
    upcoming,
    past,
  };
};
