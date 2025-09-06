import { useQuery } from '@tanstack/react-query';
import { MockSedationistService } from '../services/mockSedationistService';
import { SedationistSearchParams } from '../types';

export const useSedationistsRequest = (params: SedationistSearchParams = {}) => {
  return useQuery({
    queryKey: ['sedationists', params],
    queryFn: () => MockSedationistService.getSedationists(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useSedationistRequest = (id: string | null) => {
  return useQuery({
    queryKey: ['sedationist', id],
    queryFn: () => id ? MockSedationistService.getSedationist(id) : null,
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useSedationistCertificationsRequest = (sedationistId: string | null) => {
  return useQuery({
    queryKey: ['sedationist-certifications', sedationistId],
    queryFn: () => sedationistId ? MockSedationistService.getSedationistCertifications(sedationistId) : [],
    enabled: !!sedationistId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useSedationistAvailabilityRequest = (sedationistId: string | null) => {
  return useQuery({
    queryKey: ['sedationist-availability', sedationistId],
    queryFn: () => sedationistId ? MockSedationistService.getSedationistAvailability(sedationistId) : [],
    enabled: !!sedationistId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useSedationistCasesRequest = (sedationistId: string | null) => {
  return useQuery({
    queryKey: ['sedationist-cases', sedationistId],
    queryFn: () => sedationistId ? MockSedationistService.getSedationistCases(sedationistId) : [],
    enabled: !!sedationistId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};