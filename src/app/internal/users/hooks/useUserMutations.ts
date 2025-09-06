import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MockUserService } from '../services/mockUserService';
import { CreateUserData, UpdateUserData, UserStatus } from '../types';
import { useToast } from '@/shared/hooks/use-toast';

export const useCreateUserRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateUserData) => MockUserService.createUser(data),
    onSuccess: (newUser) => {
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      toast({
        title: 'User created successfully',
        description: `${newUser.firstName} ${newUser.lastName} has been added to the system.`,
      });
    },
    onError: (error) => {
      console.error('Error creating user:', error);
      toast({
        title: 'Error creating user',
        description: 'There was a problem creating the user. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateUserRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: UpdateUserData) => MockUserService.updateUser(data),
    onSuccess: (updatedUser) => {
      // Update the specific user in cache
      queryClient.setQueryData(['user', updatedUser.id], updatedUser);
      
      // Update the user in the users list cache
      queryClient.setQueriesData(
        { queryKey: ['users'] },
        (oldData: any) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            items: oldData.items.map((user: any) =>
              user.id === updatedUser.id ? updatedUser : user
            ),
          };
        }
      );

      // Invalidate users list to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      toast({
        title: 'User updated successfully',
        description: `${updatedUser.firstName} ${updatedUser.lastName}'s information has been updated.`,
      });
    },
    onError: (error) => {
      console.error('Error updating user:', error);
      toast({
        title: 'Error updating user',
        description: 'There was a problem updating the user. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteUserRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (userId: string) => MockUserService.deleteUser(userId),
    onSuccess: (_, userId) => {
      // Remove the user from cache
      queryClient.removeQueries({ queryKey: ['user', userId] });
      
      // Update the users list cache
      queryClient.setQueriesData(
        { queryKey: ['users'] },
        (oldData: any) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            items: oldData.items.filter((user: any) => user.id !== userId),
            totalCount: oldData.totalCount - 1,
          };
        }
      );

      // Invalidate users list to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      toast({
        title: 'User deleted successfully',
        description: 'The user has been removed from the system.',
      });
    },
    onError: (error) => {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error deleting user',
        description: 'There was a problem deleting the user. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

export const useAssignRolesRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ userId, roles }: { userId: string; roles: string[] }) => 
      MockUserService.assignRoles(userId, roles),
    onSuccess: (updatedUser) => {
      // Update the specific user in cache
      queryClient.setQueryData(['user', updatedUser.id], updatedUser);
      
      // Update the user in the users list cache
      queryClient.setQueriesData(
        { queryKey: ['users'] },
        (oldData: any) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            items: oldData.items.map((user: any) =>
              user.id === updatedUser.id ? updatedUser : user
            ),
          };
        }
      );

      // Invalidate users list to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      toast({
        title: 'Roles updated successfully',
        description: `${updatedUser.firstName} ${updatedUser.lastName}'s roles have been updated.`,
      });
    },
    onError: (error) => {
      console.error('Error assigning roles:', error);
      toast({
        title: 'Error updating roles',
        description: 'There was a problem updating the user roles. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateUserStatusRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: UserStatus }) => 
      MockUserService.updateUserStatus(userId, status),
    onSuccess: (updatedUser) => {
      // Update the specific user in cache
      queryClient.setQueryData(['user', updatedUser.id], updatedUser);
      
      // Update the user in the users list cache
      queryClient.setQueriesData(
        { queryKey: ['users'] },
        (oldData: any) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            items: oldData.items.map((user: any) =>
              user.id === updatedUser.id ? updatedUser : user
            ),
          };
        }
      );

      // Invalidate users list to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      const statusText = updatedUser.status.replace('_', ' ').toLowerCase();
      toast({
        title: 'User status updated',
        description: `${updatedUser.firstName} ${updatedUser.lastName} is now ${statusText}.`,
      });
    },
    onError: (error) => {
      console.error('Error updating user status:', error);
      toast({
        title: 'Error updating status',
        description: 'There was a problem updating the user status. Please try again.',
        variant: 'destructive',
      });
    },
  });
};