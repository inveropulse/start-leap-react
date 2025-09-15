// Export all patient API hooks
export { usePatientsRequest } from "./findAll";
export { usePatientRequest } from "./findById";
export { useCreatePatientRequest } from "./create";
export { useUpdatePatientRequest } from "./update";
export { useDeletePatientRequest } from "./delete";
export { usePatientAppointmentsRequest } from "./appointments";
export { usePatientStatsRequest } from "./stats";
export { usePatientRecordsRequest } from "./usePatientRecordsRequest";

export const patientsRequestBaseQueryKey = ["patients"];

// Export API-specific types (Request/Response types that extend domain types)
export type { PatientsResponse } from "./findAll";
export type { CreatePatientResponse } from "./create";
export type { UpdatePatientResponse } from "./update";
export type {
  PatientAppointment,
  PatientAppointmentsResponse,
} from "./appointments";
export type { MedicalRecord } from "./usePatientRecordsRequest";
