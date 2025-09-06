import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clinicService } from '../services/clinicService';
import {
  ClinicSearchParams,
  CreateClinicRequest,
  UpdateClinicRequest,
} from '../types/clinic.types';

// Query keys for consistent caching
export const clinicQueryKeys = {
  all: ['clinics'] as const,
  lists: () => [...clinicQueryKeys.all, 'list'] as const,
  list: (params: ClinicSearchParams) => [...clinicQueryKeys.lists(), params] as const,
  details: () => [...clinicQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...clinicQueryKeys.details(), id] as const,
  management: (id: string) => [...clinicQueryKeys.all, 'management', id] as const,
};

export function useClinicsRequest(params: ClinicSearchParams = {}) {
  return useQuery({
    queryKey: clinicQueryKeys.list(params),
    queryFn: () => clinicService.getClinics(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useClinicRequest(id: string | undefined) {
  return useQuery({
    queryKey: clinicQueryKeys.detail(id!),
    queryFn: () => clinicService.getClinic(id!),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useClinicManagementRequest(id: string | undefined) {
  return useQuery({
    queryKey: clinicQueryKeys.management(id!),
    queryFn: () => clinicService.getClinicManagementData(id!),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useCreateClinicRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClinicRequest) => clinicService.createClinic(data),
    onSuccess: () => {
      // Invalidate and refetch clinic lists
      queryClient.invalidateQueries({ queryKey: clinicQueryKeys.lists() });
    },
  });
}

export function useUpdateClinicRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateClinicRequest) => clinicService.updateClinic(data),
    onSuccess: (updatedClinic) => {
      // Update the specific clinic in the cache
      queryClient.setQueryData(
        clinicQueryKeys.detail(updatedClinic.id!),
        updatedClinic
      );
      
      // Invalidate lists to reflect changes
      queryClient.invalidateQueries({ queryKey: clinicQueryKeys.lists() });
      
      // Invalidate management data
      queryClient.invalidateQueries({ 
        queryKey: clinicQueryKeys.management(updatedClinic.id!) 
      });
    },
  });
}

export function useDeleteClinicRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clinicService.deleteClinic(id),
    onSuccess: (_, deletedId) => {
      // Remove the clinic from cache
      queryClient.removeQueries({ queryKey: clinicQueryKeys.detail(deletedId) });
      queryClient.removeQueries({ queryKey: clinicQueryKeys.management(deletedId) });
      
      // Invalidate lists to reflect changes
      queryClient.invalidateQueries({ queryKey: clinicQueryKeys.lists() });
    },
  });
}