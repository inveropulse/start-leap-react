import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";
import type { AppointmentItem } from "../types/dashboard.types";
import { 
  Calendar, 
  X, 
  AlertTriangle, 
  Clock,
  User,
  MapPin,
  Eye
} from "lucide-react";

const iconMap = {
  Calendar,
  X,
  AlertTriangle,
  Clock,
  User,
  MapPin,
};

const colorVariants = {
  blue: {
    icon: "bg-blue-100 text-blue-600",
    dot: "bg-blue-500"
  },
  green: {
    icon: "bg-emerald-100 text-emerald-600", 
    dot: "bg-emerald-500"
  },
  yellow: {
    icon: "bg-amber-100 text-amber-600",
    dot: "bg-amber-500"
  },
  red: {
    icon: "bg-red-100 text-red-600",
    dot: "bg-red-500"
  },
  purple: {
    icon: "bg-violet-100 text-violet-600",
    dot: "bg-violet-500"
  }
};

const statusLabels = {
  pending: "Pending",
  confirmed: "Confirmed", 
  cancelled: "Cancelled",
  completed: "Completed",
  attention: "Needs Attention"
};

interface AppointmentOverviewProps {
  appointments: AppointmentItem[];
  className?: string;
  style?: React.CSSProperties;
}

const formatAppointmentTime = (date: Date): string => {
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const isTomorrow = date.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();
  
  const timeStr = date.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  });
  
  if (isToday) return `Today ${timeStr}`;
  if (isTomorrow) return `Tomorrow ${timeStr}`;
  
  return date.toLocaleDateString('en-GB', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

const AppointmentItemComponent = ({ appointment, isLast }: { appointment: AppointmentItem; isLast: boolean }) => {
  const IconComponent = iconMap[appointment.icon as keyof typeof iconMap];
  const colors = colorVariants[appointment.color];
  
  const handleViewDetails = () => {
    console.log(`View details for appointment ${appointment.reference}`);
    // TODO: Navigate to appointment details
  };
  
  return (
    <div className="relative flex items-start gap-4 p-4 group hover:bg-muted/50 transition-colors duration-200">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-8 top-16 w-px h-full bg-border" />
      )}
      
      {/* Icon */}
      <div className={cn(
        "relative z-10 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110",
        colors.icon
      )}>
        {IconComponent && <IconComponent className="h-4 w-4" />}
        {/* Status dot */}
        <div className={cn("absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-background", colors.dot)} />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-2">
            {/* Header */}
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-medium text-sm text-foreground">
                {appointment.patientTitle ? `${appointment.patientTitle}. ${appointment.patientName}` : appointment.patientName}
              </h4>
              <span className="text-xs text-muted-foreground">
                #{appointment.reference}
              </span>
              <span className={cn(
                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                appointment.status === 'confirmed' && "bg-emerald-100 text-emerald-700",
                appointment.status === 'pending' && "bg-blue-100 text-blue-700",
                appointment.status === 'cancelled' && "bg-red-100 text-red-700",
                appointment.status === 'attention' && "bg-amber-100 text-amber-700"
              )}>
                {statusLabels[appointment.status]}
              </span>
            </div>
            
            {/* Details */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{appointment.clinicName}</span>
              </div>
              {appointment.doctorName && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span>Dr. {appointment.doctorName}</span>
                </div>
              )}
              {appointment.procedure && (
                <p className="text-sm text-muted-foreground">
                  {appointment.procedure}
                </p>
              )}
              {appointment.requiresAttention && appointment.attentionReason && (
                <p className="text-sm text-amber-700 font-medium">
                  ⚠️ {appointment.attentionReason}
                </p>
              )}
            </div>
          </div>
          
          {/* Time and Actions */}
          <div className="flex-shrink-0 text-right space-y-2">
            <time className="text-xs text-muted-foreground block">
              {appointment.type === 'cancelled' 
                ? `Cancelled ${formatAppointmentTime(appointment.startTime)}`
                : formatAppointmentTime(appointment.startTime)
              }
            </time>
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewDetails}
              className="h-7 px-2 text-xs"
            >
              <Eye className="h-3 w-3 mr-1" />
              View
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AppointmentOverview = ({ appointments, className, style }: AppointmentOverviewProps) => {
  return (
    <Card className={cn("", className)} style={style}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Appointment Overview</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {appointments.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No appointments to display</p>
            </div>
          ) : (
            appointments.map((appointment, index) => (
              <AppointmentItemComponent 
                key={appointment.id} 
                appointment={appointment} 
                isLast={index === appointments.length - 1}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};