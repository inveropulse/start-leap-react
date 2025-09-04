import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientService } from '../services/patientService';
import { 
  PatientSearchParams, 
  CreatePatientRequest, 
  UpdatePatientRequest 
} from '../types/patient.types';

// Query keys
export const patientQueryKeys = {
  all: ['patients'] as const,
  lists: () => [...patientQueryKeys.all, 'list'] as const,
  list: (params: PatientSearchParams) => [...patientQueryKeys.lists(), params] as const,
  details: () => [...patientQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...patientQueryKeys.details(), id] as const,
};

// Get paginated patients with search
export function usePatientsRequest(params: PatientSearchParams = {}) {
  return useQuery({
    queryKey: patientQueryKeys.list(params),
    queryFn: () => patientService.getPatients(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get single patient by ID
export function usePatientRequest(id: string | undefined) {
  return useQuery({
    queryKey: patientQueryKeys.detail(id!),
    queryFn: () => patientService.getPatient(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Create new patient
export function useCreatePatientRequest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePatientRequest) => patientService.createPatient(data),
    onSuccess: () => {
      // Invalidate and refetch patient lists
      queryClient.invalidateQueries({ 
        queryKey: patientQueryKeys.lists() 
      });
    },
    onError: (error) => {
      console.error('Failed to create patient:', error);
    },
  });
}

// Update existing patient
export function useUpdatePatientRequest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdatePatientRequest) => patientService.updatePatient(data),
    onSuccess: (updatedPatient) => {
      // Update specific patient in cache
      queryClient.setQueryData(
        patientQueryKeys.detail(updatedPatient.id!), 
        updatedPatient
      );
      
      // Invalidate patient lists to reflect changes
      queryClient.invalidateQueries({ 
        queryKey: patientQueryKeys.lists() 
      });
    },
    onError: (error) => {
      console.error('Failed to update patient:', error);
    },
  });
}

// Delete patient
export function useDeletePatientRequest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => patientService.deletePatient(id),
    onSuccess: (_, deletedId) => {
      // Remove patient from cache
      queryClient.removeQueries({ 
        queryKey: patientQueryKeys.detail(deletedId) 
      });
      
      // Invalidate patient lists
      queryClient.invalidateQueries({ 
        queryKey: patientQueryKeys.lists() 
      });
    },
    onError: (error) => {
      console.error('Failed to delete patient:', error);
    },
  });
}