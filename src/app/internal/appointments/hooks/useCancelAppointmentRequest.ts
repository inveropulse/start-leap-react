import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CancelAppointmentParams {
  appointmentId: string;
  reason: string;
}

interface CancelAppointmentResponse {
  success: boolean;
  message: string;
}

export function useCancelAppointmentRequest() {
  const queryClient = useQueryClient();

  return useMutation<CancelAppointmentResponse, Error, CancelAppointmentParams>({
    mutationFn: async ({ appointmentId, reason }) => {
      // Simulate API call with fake delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Fake success response - this can be easily replaced with real API call
      console.log(`Cancelling appointment ${appointmentId} with reason: ${reason}`);
      
      return {
        success: true,
        message: 'Appointment cancelled successfully'
      };
    },
    onSuccess: () => {
      // Invalidate any appointment-related queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['patient-appointments'] });
    },
  });
}