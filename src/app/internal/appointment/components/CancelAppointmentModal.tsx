import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { FormTextArea } from '@/shared/components/form/FormTextArea';
import { Form } from '@/shared/components/ui/form';
import { Separator } from '@/shared/components/ui/separator';
import { Calendar, Clock, User, Stethoscope, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { Appointment } from '../types';
import { useCancelAppointmentRequest } from '../hooks/useCancelAppointmentRequest';
import { useNotifications } from '@/shared/providers/NotificationProvider';

const cancelSchema = z.object({
  reason: z.string()
    .min(10, 'Please provide at least 10 characters explaining the cancellation reason')
    .max(500, 'Reason must be less than 500 characters'),
});

type CancelFormData = z.infer<typeof cancelSchema>;

interface CancelAppointmentModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CancelAppointmentModal({ appointment, isOpen, onClose }: CancelAppointmentModalProps) {
  const { showSuccess, showError } = useNotifications();
  const cancelMutation = useCancelAppointmentRequest();

  const form = useForm<CancelFormData>({
    resolver: zodResolver(cancelSchema),
    defaultValues: {
      reason: '',
    },
  });

  const handleCancel = async (data: CancelFormData) => {
    if (!appointment) return;

    try {
      await cancelMutation.mutateAsync({
        appointmentId: appointment.id,
        reason: data.reason,
      });

      showSuccess('Appointment cancelled successfully');
      form.reset();
      onClose();
    } catch (error) {
      showError('Failed to cancel appointment. Please try again.');
    }
  };

  const formatDateTime = (date: string, time: string): string => {
    try {
      const dateTime = new Date(`${date}T${time}`);
      return format(dateTime, 'EEEE, MMMM d, yyyy • h:mm a');
    } catch {
      return `${date} • ${time}`;
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <DialogTitle className="text-lg">Cancel Appointment</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Appointment Details */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {appointment.patient.firstName} {appointment.patient.lastName}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDateTime(appointment.appointmentDate, appointment.appointmentTime)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
              <span>{appointment.procedure}</span>
            </div>
          </div>

          <Separator />

          {/* Warning Message */}
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <p className="text-sm text-destructive font-medium">
              This action cannot be undone. The appointment will be permanently cancelled.
            </p>
          </div>

          {/* Cancellation Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCancel)} className="space-y-4">
              <FormTextArea
                control={form.control}
                name="reason"
                label="Cancellation Reason"
                placeholder="Please explain why this appointment is being cancelled (minimum 10 characters)..."
                className="min-h-[100px]"
                required
                loading={cancelMutation.isPending}
              />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={cancelMutation.isPending}
                >
                  Keep Appointment
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={cancelMutation.isPending}
                >
                  {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Appointment'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}