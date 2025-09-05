import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";
import { Calendar, Clock, MapPin, User, Phone, DollarSign, FileText, Stethoscope } from "lucide-react";
import { PatientAppointment } from "../services/appointmentService";
import { format } from "date-fns";
import { Separator } from "@/shared/components/ui/separator";

interface AppointmentDetailsModalProps {
  appointment: PatientAppointment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AppointmentDetailsModal({ appointment, isOpen, onClose }: AppointmentDetailsModalProps) {
  if (!appointment) return null;

  const formatDateTime = (dateTime: string) => {
    try {
      return format(new Date(dateTime), "EEEE, MMMM dd, yyyy 'at' h:mm a");
    } catch {
      return "Invalid date";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'no-show':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Appointment Details</span>
            <Badge className={getStatusColor(appointment.status)}>
              {appointment.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{formatDateTime(appointment.dateTime)}</p>
                <p className="text-sm text-muted-foreground">Duration: {appointment.duration} minutes</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Dr. {appointment.doctorName}</p>
                <p className="text-sm text-muted-foreground">Doctor ID: {appointment.doctorId}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{appointment.clinicName}</p>
                <p className="text-sm text-muted-foreground">Clinic ID: {appointment.clinicId}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Procedure & Treatment */}
          {appointment.procedure && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">Procedure</span>
              </div>
              <p className="text-sm pl-6">{appointment.procedure}</p>
            </div>
          )}

          {/* Sedationist */}
          {appointment.sedationistName && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">Sedationist</span>
              </div>
              <p className="text-sm pl-6">{appointment.sedationistName}</p>
            </div>
          )}

          {/* Financial Information */}
          {appointment.fee && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">Fee</span>
              </div>
              <p className="text-sm pl-6">${appointment.fee}</p>
            </div>
          )}

          {/* Reference */}
          {appointment.reference && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">Reference</span>
              </div>
              <p className="text-sm pl-6 font-mono">{appointment.reference}</p>
            </div>
          )}

          {/* Notes */}
          {appointment.notes && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">Notes</span>
                </div>
                <p className="text-sm pl-6 bg-muted p-3 rounded-md">{appointment.notes}</p>
              </div>
            </>
          )}

          {/* Appointment ID (for internal reference) */}
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">Appointment ID: {appointment.id}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}