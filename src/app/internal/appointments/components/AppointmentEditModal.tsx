import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Form } from '@/shared/components/ui/form';
import { Separator } from '@/shared/components/ui/separator';
import {
  FormTextField,
  FormTextArea,
  FormDateField,
  FormTimeField,
  FormSelect
} from '@/shared/components/form';
import { Appointment, AppointmentStatus, AppointmentType } from '../types';

const appointmentSchema = z.object({
  patientFirstName: z.string().min(2, 'First name must be at least 2 characters'),
  patientLastName: z.string().min(2, 'Last name must be at least 2 characters'),
  patientEmail: z.string().email('Invalid email address'),
  patientPhone: z.string().min(10, 'Phone number must be at least 10 characters'),
  patientDateOfBirth: z.string().min(1, 'Date of birth is required'),
  appointmentDate: z.string().min(1, 'Appointment date is required'),
  appointmentTime: z.string().min(1, 'Appointment time is required'),
  duration: z.number().min(15, 'Duration must be at least 15 minutes'),
  type: z.nativeEnum(AppointmentType),
  status: z.nativeEnum(AppointmentStatus),
  procedure: z.string().min(2, 'Procedure must be at least 2 characters'),
  notes: z.string().optional(),
  doctorFirstName: z.string().min(2, 'Doctor first name is required'),
  doctorLastName: z.string().min(2, 'Doctor last name is required'),
  doctorSpecialization: z.string().min(2, 'Specialization is required'),
  clinicName: z.string().min(2, 'Clinic name is required'),
  clinicAddress: z.string().min(5, 'Clinic address is required'),
  clinicPhone: z.string().min(10, 'Clinic phone is required'),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentEditModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Appointment) => void;
}

export function AppointmentEditModal({
  appointment,
  isOpen,
  onClose,
  onSave,
}: AppointmentEditModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientFirstName: '',
      patientLastName: '',
      patientEmail: '',
      patientPhone: '',
      patientDateOfBirth: '',
      appointmentDate: '',
      appointmentTime: '',
      duration: 30,
      type: AppointmentType.CONSULTATION,
      status: AppointmentStatus.SCHEDULED,
      procedure: '',
      notes: '',
      doctorFirstName: '',
      doctorLastName: '',
      doctorSpecialization: '',
      clinicName: '',
      clinicAddress: '',
      clinicPhone: '',
    },
  });

  // Populate form when appointment changes
  useEffect(() => {
    if (appointment) {
      form.reset({
        patientFirstName: appointment.patient.firstName,
        patientLastName: appointment.patient.lastName,
        patientEmail: appointment.patient.email,
        patientPhone: appointment.patient.phone,
        patientDateOfBirth: appointment.patient.dateOfBirth,
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime,
        duration: appointment.duration,
        type: appointment.type,
        status: appointment.status,
        procedure: appointment.procedure,
        notes: appointment.notes || '',
        doctorFirstName: appointment.doctor.firstName,
        doctorLastName: appointment.doctor.lastName,
        doctorSpecialization: appointment.doctor.specialization,
        clinicName: appointment.clinic.name,
        clinicAddress: appointment.clinic.address,
        clinicPhone: appointment.clinic.phone,
      });
    }
  }, [appointment, form]);

  const handleSave = async (data: AppointmentFormData) => {
    if (!appointment) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedAppointment: Appointment = {
        ...appointment,
        patient: {
          ...appointment.patient,
          firstName: data.patientFirstName,
          lastName: data.patientLastName,
          email: data.patientEmail,
          phone: data.patientPhone,
          dateOfBirth: data.patientDateOfBirth,
        },
        doctor: {
          ...appointment.doctor,
          firstName: data.doctorFirstName,
          lastName: data.doctorLastName,
          specialization: data.doctorSpecialization,
        },
        clinic: {
          ...appointment.clinic,
          name: data.clinicName,
          address: data.clinicAddress,
          phone: data.clinicPhone,
        },
        appointmentDate: data.appointmentDate,
        appointmentTime: data.appointmentTime,
        duration: data.duration,
        type: data.type,
        status: data.status,
        procedure: data.procedure,
        notes: data.notes,
        updatedAt: new Date().toISOString(),
      };

      onSave(updatedAppointment);
      onClose();
    } catch (error) {
      console.error('Failed to save appointment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusOptions = () => {
    return Object.values(AppointmentStatus).map((status) => ({
      value: status,
      label: status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    }));
  };

  const getTypeOptions = () => {
    return Object.values(AppointmentType).map((type) => ({
      value: type,
      label: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-xl font-semibold">
            Edit Appointment
          </DialogTitle>
          <div className="flex gap-2">
            <Button
              type="submit"
              form="appointment-form"
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            id="appointment-form"
            onSubmit={form.handleSubmit(handleSave)}
            className="space-y-6"
          >
            {/* Patient Information */}
            <div>
              <h3 className="text-lg font-medium mb-4">Patient Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormTextField
                  control={form.control}
                  name="patientFirstName"
                  label="First Name"
                  required
                />
                <FormTextField
                  control={form.control}
                  name="patientLastName"
                  label="Last Name"
                  required
                />
                <FormTextField
                  control={form.control}
                  name="patientEmail"
                  label="Email"
                  type="email"
                  required
                />
                <FormTextField
                  control={form.control}
                  name="patientPhone"
                  label="Phone"
                  type="tel"
                  required
                />
                <FormDateField
                  control={form.control}
                  name="patientDateOfBirth"
                  label="Date of Birth"
                  required
                />
              </div>
            </div>

            <Separator />

            {/* Appointment Details */}
            <div>
              <h3 className="text-lg font-medium mb-4">Appointment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormDateField
                  control={form.control}
                  name="appointmentDate"
                  label="Appointment Date"
                  required
                />
                <FormTimeField
                  control={form.control}
                  name="appointmentTime"
                  label="Appointment Time"
                  required
                />
                <FormTextField
                  control={form.control}
                  name="duration"
                  label="Duration (minutes)"
                  type="number"
                  min="15"
                  step="15"
                  required
                />
                <FormSelect
                  control={form.control}
                  name="type"
                  label="Appointment Type"
                  options={getTypeOptions()}
                  required
                />
                <FormSelect
                  control={form.control}
                  name="status"
                  label="Status"
                  options={getStatusOptions()}
                  required
                />
                <FormTextField
                  control={form.control}
                  name="procedure"
                  label="Procedure"
                  required
                />
              </div>
              <div className="mt-4">
                <FormTextArea
                  control={form.control}
                  name="notes"
                  label="Notes"
                  placeholder="Additional notes or special instructions..."
                  rows={3}
                />
              </div>
            </div>

            <Separator />

            {/* Doctor Information */}
            <div>
              <h3 className="text-lg font-medium mb-4">Doctor Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormTextField
                  control={form.control}
                  name="doctorFirstName"
                  label="Doctor First Name"
                  required
                />
                <FormTextField
                  control={form.control}
                  name="doctorLastName"
                  label="Doctor Last Name"
                  required
                />
                <FormTextField
                  control={form.control}
                  name="doctorSpecialization"
                  label="Specialization"
                  required
                />
              </div>
            </div>

            <Separator />

            {/* Clinic Information */}
            <div>
              <h3 className="text-lg font-medium mb-4">Clinic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormTextField
                  control={form.control}
                  name="clinicName"
                  label="Clinic Name"
                  required
                />
                <FormTextField
                  control={form.control}
                  name="clinicPhone"
                  label="Clinic Phone"
                  type="tel"
                  required
                />
                <FormTextField
                  control={form.control}
                  name="clinicAddress"
                  label="Clinic Address"
                  required
                  className="md:col-span-2"
                />
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}