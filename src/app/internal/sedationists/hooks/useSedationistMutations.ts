import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MockSedationistService } from '../services/mockSedationistService';
import { CreateSedationistData, UpdateSedationistData } from '../types';

export const useCreateSedationistRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSedationistData) => MockSedationistService.createSedationist(data),
    onSuccess: () => {
      // Invalidate and refetch sedationists list
      queryClient.invalidateQueries({ queryKey: ['sedationists'] });
    },
  });
};

export const useUpdateSedationistRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSedationistData) => MockSedationistService.updateSedationist(data),
    onSuccess: (updatedSedationist) => {
      // Invalidate and refetch sedationists list
      queryClient.invalidateQueries({ queryKey: ['sedationists'] });
      // Update specific sedationist cache
      queryClient.setQueryData(['sedationist', updatedSedationist.id], updatedSedationist);
    },
  });
};

export const useDeleteSedationistRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => MockSedationistService.deleteSedationist(id),
    onSuccess: () => {
      // Invalidate and refetch sedationists list
      queryClient.invalidateQueries({ queryKey: ['sedationists'] });
    },
  });
};