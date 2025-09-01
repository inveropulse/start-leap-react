import { useQuery } from '@tanstack/react-query';
import { getMockDashboardData } from '../utils/mockData';
import type { DashboardData } from '../types/dashboard.types';

export const useDashboardData = () => {
  return useQuery<DashboardData>({
    queryKey: ['dashboard-data'],
    queryFn: getMockDashboardData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time feel
  });
};