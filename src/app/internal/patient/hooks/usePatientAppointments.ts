import { useQuery } from '@tanstack/react-query';
import { appointmentService } from '../services/appointmentService';

export function usePatientAppointments(patientId: string | undefined) {
  return useQuery({
    queryKey: ['patient-appointments', patientId],
    queryFn: () => appointmentService.getPatientAppointments(patientId!),
    enabled: !!patientId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}