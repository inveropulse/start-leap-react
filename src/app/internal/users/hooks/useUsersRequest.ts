import { useQuery } from '@tanstack/react-query';
import { MockUserService } from '../services/mockUserService';
import { UserSearchParams } from '../types';

export const useUsersRequest = (params: UserSearchParams = {}) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => MockUserService.getUsers(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUserRequest = (id: string | null) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => id ? MockUserService.getUser(id) : null,
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUserActivitiesRequest = (userId: string | null) => {
  return useQuery({
    queryKey: ['user-activities', userId],
    queryFn: () => userId ? MockUserService.getUserActivities(userId) : [],
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUserSessionsRequest = (userId: string | null) => {
  return useQuery({
    queryKey: ['user-sessions', userId],
    queryFn: () => userId ? MockUserService.getUserSessions(userId) : [],
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};