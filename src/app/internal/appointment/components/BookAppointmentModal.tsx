import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Clock, User, MapPin, Stethoscope, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import { AppointmentType } from '../types';
import { useBookAppointmentRequest } from '../hooks/useBookAppointmentRequest';

const bookAppointmentSchema = z.object({
  patientFirstName: z.string().min(2, 'First name must be at least 2 characters'),
  patientLastName: z.string().min(2, 'Last name must be at least 2 characters'),
  patientEmail: z.string().email('Please enter a valid email address'),
  patientPhone: z.string().min(10, 'Phone number must be at least 10 characters'),
  patientDateOfBirth: z.string().min(1, 'Date of birth is required'),
  doctorId: z.string().min(1, 'Please select a doctor'),
  clinicId: z.string().min(1, 'Please select a clinic'),
  appointmentDate: z.string().min(1, 'Appointment date is required'),
  appointmentTime: z.string().min(1, 'Appointment time is required'),
  duration: z.string().min(1, 'Duration is required'),
  type: z.nativeEnum(AppointmentType),
  procedure: z.string().min(3, 'Procedure must be at least 3 characters'),
  notes: z.string().optional(),
});

type BookAppointmentFormData = z.infer<typeof bookAppointmentSchema>;

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock data - can be easily replaced with real data later
const mockDoctors = [
  { id: 'doc1', name: 'Dr. Sarah Johnson', specialization: 'Cardiology' },
  { id: 'doc2', name: 'Dr. Michael Chen', specialization: 'Dermatology' },
  { id: 'doc3', name: 'Dr. Emily Rodriguez', specialization: 'Pediatrics' },
];

const mockClinics = [
  { id: 'clinic1', name: 'Downtown Medical Center', address: '123 Main St' },
  { id: 'clinic2', name: 'Westside Health Clinic', address: '456 Oak Ave' },
  { id: 'clinic3', name: 'Eastpark Medical', address: '789 Pine Rd' },
];

export function BookAppointmentModal({ isOpen, onClose }: BookAppointmentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const bookAppointmentMutation = useBookAppointmentRequest();

  const form = useForm<BookAppointmentFormData>({
    resolver: zodResolver(bookAppointmentSchema),
    defaultValues: {
      patientFirstName: '',
      patientLastName: '',
      patientEmail: '',
      patientPhone: '',
      patientDateOfBirth: '',
      doctorId: '',
      clinicId: '',
      appointmentDate: '',
      appointmentTime: '',
      duration: '30',
      type: AppointmentType.CONSULTATION,
      procedure: '',
      notes: '',
    },
  });

  const onSubmit = async (data: BookAppointmentFormData) => {
    setIsSubmitting(true);
    try {
      await bookAppointmentMutation.mutateAsync(data);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error booking appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Book New Appointment
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Patient Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <User className="h-4 w-4 text-primary" />
                Patient Information
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                <FormField
                  control={form.control}
                  name="patientFirstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="patientLastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="patientEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="patient@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="patientPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="patientDateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Appointment Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-primary" />
                Appointment Details
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                <FormField
                  control={form.control}
                  name="doctorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Doctor</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a doctor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockDoctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id}>
                              {doctor.name} - {doctor.specialization}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clinicId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clinic</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a clinic" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockClinics.map((clinic) => (
                            <SelectItem key={clinic.id} value={clinic.id}>
                              {clinic.name} - {clinic.address}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="appointmentDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="appointmentTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="90">1.5 hours</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={AppointmentType.CONSULTATION}>Consultation</SelectItem>
                          <SelectItem value={AppointmentType.FOLLOW_UP}>Follow Up</SelectItem>
                          <SelectItem value={AppointmentType.PROCEDURE}>Procedure</SelectItem>
                          <SelectItem value={AppointmentType.ROUTINE_CHECK}>Routine Check</SelectItem>
                          <SelectItem value={AppointmentType.EMERGENCY}>Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Stethoscope className="h-4 w-4 text-primary" />
                Medical Information
              </div>

              <div className="pl-6 space-y-4">
                <FormField
                  control={form.control}
                  name="procedure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Procedure</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Routine check-up, Blood pressure monitoring..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any additional information, special requirements, or notes..."
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Booking...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Book Appointment
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}