import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Clock, User, MapPin } from "lucide-react";

// Mock appointment type for now - will be replaced with actual API types in Phase 4
interface MockAppointment {
  id: string;
  patientName: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  location?: string;
  type: string;
}

interface AppointmentCardProps {
  appointment: MockAppointment;
  onClick?: () => void;
}

export function AppointmentCard({ appointment, onClick }: AppointmentCardProps) {
  const getStatusColor = (status: MockAppointment['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: MockAppointment['status']) => {
    switch (status) {
      case 'scheduled':
        return 'Scheduled';
      case 'confirmed':
        return 'Confirmed';
      case 'in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-primary"
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="space-y-2">
          {/* Header with time and status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm font-medium">
              <Clock className="h-3 w-3" />
              {appointment.startTime} - {appointment.endTime}
            </div>
            <Badge 
              variant="outline"
              className={`text-xs ${getStatusColor(appointment.status)}`}
            >
              {getStatusLabel(appointment.status)}
            </Badge>
          </div>

          {/* Patient info */}
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm">{appointment.patientName}</span>
          </div>

          {/* Appointment type */}
          <div className="text-xs text-muted-foreground">
            {appointment.type}
          </div>

          {/* Location if available */}
          {appointment.location && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {appointment.location}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}