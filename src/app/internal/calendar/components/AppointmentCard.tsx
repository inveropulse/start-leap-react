import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Clock, User, MapPin, Stethoscope, Phone } from "lucide-react";
import { DiaryAppointmentDto } from "@/api/generated/models/DiaryAppointmentDto";
import { 
  getAppointmentStatusColor, 
  getAppointmentStatusText, 
  formatAppointmentTime,
  formatPatientName,
  getAppointmentSummary,
  getAppointmentLayoutMode
} from "../utils/appointmentUtils";
import { cn } from "@/shared/utils/cn";

interface AppointmentCardProps {
  appointment: DiaryAppointmentDto;
  className?: string;
  size?: "sm" | "md" | "lg";
  fullHeight?: number; // Height in pixels for spanning multiple slots
  onClick?: () => void;
}

export function AppointmentCard({ 
  appointment, 
  className, 
  size = "md",
  fullHeight,
  onClick 
}: AppointmentCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const statusColor = getAppointmentStatusColor(appointment.status);
  const statusText = getAppointmentStatusText(appointment.status);
  const timeText = formatAppointmentTime(appointment.start, appointment.end);
  const patientName = formatPatientName(appointment);
  const summary = getAppointmentSummary(appointment);
  const layoutMode = getAppointmentLayoutMode(fullHeight);

  const cardSizes = {
    sm: "p-2 text-xs",
    md: "p-3 text-sm",
    lg: "p-4 text-sm"
  };

  const adaptiveSizes = {
    compact: "p-1 text-xs",
    normal: "p-2 text-xs", 
    expanded: cardSizes[size]
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 border-l-4",
        statusColor.replace("bg-", "border-l-"),
        isHovered && "shadow-md transform scale-[1.02]",
        onClick && "hover:shadow-lg",
        fullHeight && "absolute top-0 left-0 right-0 z-10",
        className
      )}
      style={fullHeight ? { height: `${fullHeight}px` } : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <CardContent className={fullHeight ? adaptiveSizes[layoutMode] : cardSizes[size]}>
        {layoutMode === 'compact' && (
          <div className="h-full flex flex-col justify-center space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground truncate flex-1 pr-1 text-xs leading-tight">
                {patientName}
              </span>
              <Badge 
                variant="secondary" 
                className={cn("text-[8px] px-1 py-0 shrink-0", statusColor, "text-white")}
              >
                {statusText}
              </Badge>
            </div>
            <div className="text-[10px] text-muted-foreground">
              {timeText}
            </div>
          </div>
        )}

        {layoutMode === 'normal' && (
          <div className="space-y-1 h-full flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground font-medium">{timeText}</span>
              <Badge 
                variant="secondary" 
                className={cn("text-[10px] px-1 py-0", statusColor, "text-white")}
              >
                {statusText}
              </Badge>
            </div>
            <div className="font-semibold text-foreground truncate text-xs">
              {patientName}
            </div>
            {appointment.procedure && (
              <div className="text-[10px] text-muted-foreground truncate">
                {appointment.procedure}
              </div>
            )}
          </div>
        )}

        {layoutMode === 'expanded' && (
          <div className="space-y-2">
            {/* Header with time and status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span className="font-medium">{timeText}</span>
              </div>
              <Badge 
                variant="secondary" 
                className={cn("text-xs", statusColor, "text-white")}
              >
                {statusText}
              </Badge>
            </div>

            {/* Patient info */}
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3 text-muted-foreground" />
                <span className="font-semibold text-foreground truncate">
                  {patientName}
                </span>
              </div>
              
              {appointment.procedure && (
                <div className="flex items-center gap-1">
                  <Stethoscope className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground truncate">
                    {appointment.procedure}
                  </span>
                </div>
              )}
            </div>

            {/* Doctor and clinic info for larger cards */}
            {size === "lg" && (
              <div className="space-y-1 text-xs">
                {appointment.doctorName && (
                  <div className="text-muted-foreground">
                    Dr. {appointment.doctorName}
                  </div>
                )}
                
                {appointment.clinicName && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{appointment.clinicName}</span>
                  </div>
                )}
                
                {appointment.patientPhoneNumber && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span>{appointment.patientPhoneNumber}</span>
                  </div>
                )}
              </div>
            )}

            {/* Reference for smaller cards */}
            {size !== "lg" && appointment.reference && (
              <div className="text-xs text-muted-foreground">
                Ref: {appointment.reference}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}