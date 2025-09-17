// Export all patient API hooks
export { useFindAllPatientsRequest as usePatientsRequest } from "./findAll";
export { useFindByIdPatientRequest as usePatientRequest } from "./findById";
export { useCreatePatientRequest } from "./create";
export { useUpdatePatientRequest } from "./update";
export { useDeletePatientRequest } from "./delete";
export { usePatientAppointmentsRequest } from "./appointments";
export { usePatientStatsRequest } from "./stats";
export { usePatientRecordsRequest } from "./usePatientRecordsRequest";

// Export API-specific types (Request/Response types that extend domain types)
export * from "./types";
export type { MedicalRecord } from "./usePatientRecordsRequest";
