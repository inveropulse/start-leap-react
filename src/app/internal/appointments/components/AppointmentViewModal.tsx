import { format } from 'date-fns';
import { Calendar, Clock, User, Phone, Mail, MapPin, Stethoscope, FileText, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Separator } from '@/shared/components/ui/separator';
import { Appointment, AppointmentStatus } from '../types';

interface AppointmentViewModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (appointment: Appointment) => void;
}

export function AppointmentViewModal({ 
  appointment, 
  isOpen, 
  onClose, 
  onEdit 
}: AppointmentViewModalProps) {
  if (!appointment) return null;

  const getStatusVariant = (status: AppointmentStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case AppointmentStatus.CONFIRMED:
      case AppointmentStatus.COMPLETED:
        return 'default';
      case AppointmentStatus.SCHEDULED:
      case AppointmentStatus.IN_PROGRESS:
        return 'secondary';
      case AppointmentStatus.CANCELLED:
      case AppointmentStatus.NO_SHOW:
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: AppointmentStatus): string => {
    switch (status) {
      case AppointmentStatus.SCHEDULED: return 'Scheduled';
      case AppointmentStatus.CONFIRMED: return 'Confirmed';
      case AppointmentStatus.IN_PROGRESS: return 'In Progress';
      case AppointmentStatus.COMPLETED: return 'Completed';
      case AppointmentStatus.CANCELLED: return 'Cancelled';
      case AppointmentStatus.NO_SHOW: return 'No Show';
      case AppointmentStatus.RESCHEDULED: return 'Rescheduled';
      default: return status;
    }
  };

  const formatAppointmentDateTime = (date: string, time: string): string => {
    try {
      const dateTime = new Date(`${date}T${time}`);
      return format(dateTime, 'EEEE, MMMM dd, yyyy • HH:mm');
    } catch {
      return `${date} • ${time}`;
    }
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} minutes`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="flex-1">
            <DialogTitle className="text-xl font-semibold">
              Appointment Details
            </DialogTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={getStatusVariant(appointment.status)}>
                {getStatusLabel(appointment.status)}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Ref: {appointment.reference}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(appointment)}
              >
                Edit Appointment
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Appointment Time & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-primary" />
                Date & Time
              </div>
              <div className="text-sm pl-6">
                {formatAppointmentDateTime(appointment.appointmentDate, appointment.appointmentTime)}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4 text-primary" />
                Duration
              </div>
              <div className="text-sm pl-6">
                {formatDuration(appointment.duration)}
              </div>
            </div>
          </div>

          <Separator />

          {/* Patient Information */}
          <div>
            <div className="flex items-center gap-2 text-sm font-medium mb-3">
              <User className="h-4 w-4 text-primary" />
              Patient Information
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
              <div>
                <div className="font-medium">
                  {appointment.patient.firstName} {appointment.patient.lastName}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  DOB: {format(new Date(appointment.patient.dateOfBirth), 'MMM dd, yyyy')}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span>{appointment.patient.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span>{appointment.patient.email}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Medical Information */}
          <div>
            <div className="flex items-center gap-2 text-sm font-medium mb-3">
              <Stethoscope className="h-4 w-4 text-primary" />
              Medical Information
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
              <div>
                <div className="text-sm font-medium">Procedure</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {appointment.procedure}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Type</div>
                <div className="text-sm text-muted-foreground mt-1 capitalize">
                  {appointment.type.replace('_', ' ')}
                </div>
              </div>
            </div>
            
            {appointment.notes && (
              <div className="mt-4 pl-6">
                <div className="text-sm font-medium mb-2">Notes</div>
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  {appointment.notes}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Healthcare Team */}
          <div>
            <div className="flex items-center gap-2 text-sm font-medium mb-3">
              <User className="h-4 w-4 text-primary" />
              Healthcare Team
            </div>
            <div className="pl-6">
              <div className="font-medium">
                {appointment.doctor.firstName} {appointment.doctor.lastName}
              </div>
              <div className="text-sm text-muted-foreground">
                {appointment.doctor.specialization}
              </div>
            </div>
          </div>

          <Separator />

          {/* Clinic Information */}
          <div>
            <div className="flex items-center gap-2 text-sm font-medium mb-3">
              <MapPin className="h-4 w-4 text-primary" />
              Clinic Information
            </div>
            <div className="pl-6 space-y-2">
              <div className="font-medium">{appointment.clinic.name}</div>
              <div className="text-sm text-muted-foreground">
                {appointment.clinic.address}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-3 w-3 text-muted-foreground" />
                <span>{appointment.clinic.phone}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Appointment History */}
          <div>
            <div className="flex items-center gap-2 text-sm font-medium mb-3">
              <FileText className="h-4 w-4 text-primary" />
              Appointment History
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 text-sm">
              <div>
                <div className="font-medium">Created</div>
                <div className="text-muted-foreground">
                  {format(new Date(appointment.createdAt), 'MMM dd, yyyy • HH:mm')}
                </div>
              </div>
              <div>
                <div className="font-medium">Last Updated</div>
                <div className="text-muted-foreground">
                  {format(new Date(appointment.updatedAt), 'MMM dd, yyyy • HH:mm')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}