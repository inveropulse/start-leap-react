import { useQuery } from '@tanstack/react-query';
import { medicalRecordService } from '../services/medicalRecordService';

export function usePatientRecords(patientId: string | undefined) {
  return useQuery({
    queryKey: ['patient-records', patientId],
    queryFn: () => medicalRecordService.getPatientRecords(patientId!),
    enabled: !!patientId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}