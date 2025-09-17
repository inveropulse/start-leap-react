import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '@/shared/providers/NotificationProvider';

interface BookAppointmentData {
  patientFirstName: string;
  patientLastName: string;
  patientEmail: string;
  patientPhone: string;
  patientDateOfBirth: string;
  doctorId: string;
  clinicId: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: string;
  type: string;
  procedure: string;
  notes?: string;
}

// Mock function - can be easily replaced with real API call later
const bookAppointment = async (data: BookAppointmentData): Promise<{ success: boolean; appointmentId: string }> => {
  // Simulate API call with loading time
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // Mock validation - simulate potential errors
  if (data.patientEmail === 'error@test.com') {
    throw new Error('Patient with this email already has a conflicting appointment');
  }
  
  // Mock success response
  return {
    success: true,
    appointmentId: `APT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  };
};

export function useBookAppointmentRequest() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: bookAppointment,
    onSuccess: (data) => {
      showSuccess(`Appointment booked successfully! Reference: ${data.appointmentId}`);
      
      // Invalidate appointments query to refresh the list
      queryClient.invalidateQueries({ 
        queryKey: ['appointments'] 
      });
    },
    onError: (error: Error) => {
      showError(error.message || 'Failed to book appointment. Please try again.');
    },
  });
}