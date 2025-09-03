import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogClose 
} from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  MapPin, 
  Stethoscope,
  DollarSign,
  FileText,
  X
} from "lucide-react";
import { DiaryAppointmentDto } from "@/api/generated/models/DiaryAppointmentDto";
import { 
  getAppointmentStatusColor, 
  getAppointmentStatusText, 
  formatAppointmentTime,
  formatPatientName 
} from "../utils/appointmentUtils";
import { format } from "date-fns";

interface AppointmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: DiaryAppointmentDto | null;
}

export function AppointmentDetailModal({ 
  isOpen, 
  onClose, 
  appointment 
}: AppointmentDetailModalProps) {
  if (!appointment) return null;

  const statusColor = getAppointmentStatusColor(appointment.status);
  const statusText = getAppointmentStatusText(appointment.status);
  const timeText = formatAppointmentTime(appointment.start, appointment.end);
  const patientName = formatPatientName(appointment);

  const appointmentDate = appointment.start ? 
    format(new Date(appointment.start), 'EEEE, MMMM d, yyyy') : 
    'Date not available';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Appointment Details
            </DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Time */}
          <div className="flex items-center justify-between">
            <Badge className={`${statusColor} text-white`}>
              {statusText}
            </Badge>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{appointmentDate}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-lg font-medium">
            <Clock className="h-5 w-5 text-primary" />
            <span>{timeText}</span>
          </div>

          <Separator />

          {/* Patient Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Patient Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <p className="text-sm">{patientName}</p>
              </div>
              
              {appointment.patientPhoneNumber && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{appointment.patientPhoneNumber}</p>
                  </div>
                </div>
              )}
              
              {appointment.patientEmail && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{appointment.patientEmail}</p>
                  </div>
                </div>
              )}
              
              {appointment.patientDOB && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                  <p className="text-sm">{format(new Date(appointment.patientDOB), 'MMM d, yyyy')}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Medical Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-primary" />
              Medical Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointment.procedure && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Procedure</label>
                  <p className="text-sm">{appointment.procedure}</p>
                </div>
              )}
              
              {appointment.treatment && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Treatment</label>
                  <p className="text-sm">{appointment.treatment}</p>
                </div>
              )}
            </div>

            {appointment.notes && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Notes</label>
                <p className="text-sm bg-muted p-3 rounded-md">{appointment.notes}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Healthcare Team */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Healthcare Team</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointment.doctorName && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Doctor</label>
                  <p className="text-sm font-medium">Dr. {appointment.doctorName}</p>
                  {appointment.doctorEmail && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span>{appointment.doctorEmail}</span>
                    </div>
                  )}
                  {appointment.doctorPhone && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span>{appointment.doctorPhone}</span>
                    </div>
                  )}
                </div>
              )}
              
              {appointment.sedationistName && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Sedationist</label>
                  <p className="text-sm font-medium">{appointment.sedationistName}</p>
                  {appointment.sedationistFee && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <DollarSign className="h-3 w-3" />
                      <span>${appointment.sedationistFee.amount?.toFixed(2) || '0.00'}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Clinic Information */}
          {appointment.clinicName && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Clinic Information
              </h3>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">{appointment.clinicName}</p>
                {appointment.clinicAddress && (
                  <p className="text-sm text-muted-foreground">{appointment.clinicAddress}</p>
                )}
                {appointment.clinicPostalCode && (
                  <p className="text-sm text-muted-foreground">{appointment.clinicPostalCode}</p>
                )}
                {appointment.clinicPhone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{appointment.clinicPhone}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Booking Status */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Booking Form</div>
              <Badge variant={appointment.bookingFormReceived ? "default" : "secondary"}>
                {appointment.bookingFormReceived ? "Received" : "Pending"}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Patient Pack</div>
              <Badge variant={appointment.patientPackReceived ? "default" : "secondary"}>
                {appointment.patientPackReceived ? "Received" : "Pending"}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Payment</div>
              <Badge variant={appointment.paymentReceived ? "default" : "secondary"}>
                {appointment.paymentReceived ? "Received" : "Pending"}
              </Badge>
            </div>
          </div>

          {appointment.reference && (
            <div className="text-center text-xs text-muted-foreground">
              Reference: {appointment.reference}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}