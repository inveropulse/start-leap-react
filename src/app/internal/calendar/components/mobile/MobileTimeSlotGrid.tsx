import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { format, startOfDay, endOfDay } from "date-fns";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import { APP_CONFIG } from "@/shared/AppConfig";
import { useCalendarStore } from "../../store/calendarStore";
import { PortalType } from "@/shared/types";
import { useCalendarAppointments } from "../../hooks/useCalendarData";
import { AppointmentCard } from "../AppointmentCard";
import { isAppointmentInTimeSlot, isAppointmentStartInSlot, formatPatientName } from "../../utils/appointmentUtils";

interface MobileTimeSlotGridProps {
  date: Date;
}

export function MobileTimeSlotGrid({ date }: MobileTimeSlotGridProps) {
  const { selectedSedationistIds, sedationists, openAppointmentModal } = useCalendarStore(PortalType.INTERNAL);
  const [currentSedationistIndex, setCurrentSedationistIndex] = useState(0);
  
  const selectedSedationistsList = sedationists?.filter(s => 
    selectedSedationistIds.includes(s.id!)
  ) || [];
  
  const currentSedationist = selectedSedationistsList[currentSedationistIndex];
  
  const { data: appointments, isLoading } = useCalendarAppointments(
    selectedSedationistIds,
    startOfDay(date),
    endOfDay(date)
  );

  const generateTimeSlots = () => {
    const slots = [];
    const startHour = APP_CONFIG.calendar.defaultStartHour || 6;
    const endHour = APP_CONFIG.calendar.defaultEndHour || 21;
    const slotDuration = APP_CONFIG.calendar.timeSlotDuration || 60;

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          time: timeString,
          displayTime: minute === 0 ? `${hour}:00` : `${hour}:${minute.toString().padStart(2, '0')}`,
        });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const formatDate = (date: Date) => format(date, 'EEE, MMM dd');

  const navigateSedationist = (direction: "prev" | "next") => {
    if (direction === "next" && currentSedationistIndex < selectedSedationistsList.length - 1) {
      setCurrentSedationistIndex(prev => prev + 1);
    } else if (direction === "prev" && currentSedationistIndex > 0) {
      setCurrentSedationistIndex(prev => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <Card className="mx-4">
        <CardHeader>
          <CardTitle className="text-lg">Loading schedule...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded-lg"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (selectedSedationistsList.length === 0) {
    return (
      <Card className="mx-4">
        <CardHeader>
          <CardTitle className="text-lg">Schedule - {formatDate(date)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-2">No sedationists selected</p>
            <p className="text-sm text-muted-foreground">Please select sedationists to view their schedules</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-4">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Schedule - {formatDate(date)}</CardTitle>
            {currentSedationist && (
              <p className="text-sm text-muted-foreground mt-1">
                {currentSedationist.firstName} {currentSedationist.lastName}
              </p>
            )}
          </div>
          
          {selectedSedationistsList.length > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateSedationist("prev")}
                disabled={currentSedationistIndex === 0}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-xs text-muted-foreground px-2">
                {currentSedationistIndex + 1} of {selectedSedationistsList.length}
              </span>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateSedationist("next")}
                disabled={currentSedationistIndex === selectedSedationistsList.length - 1}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          {timeSlots.map((slot) => {
            const sedationistAppointments = appointments?.filter(apt => 
              apt.sedationistId === currentSedationist?.id &&
              isAppointmentInTimeSlot(apt, slot.time, APP_CONFIG.calendar.timeSlotDuration || 60)
            ) || [];

            const startingAppointments = sedationistAppointments.filter(apt => 
              isAppointmentStartInSlot(apt, slot.time, APP_CONFIG.calendar.timeSlotDuration || 60)
            );

            return (
              <div key={slot.time} className="flex gap-3">
                <div className="w-16 flex-shrink-0 pt-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    {slot.displayTime}
                  </div>
                </div>
                
                <div className="flex-1 min-h-[60px]">
                  {startingAppointments.length > 0 ? (
                    <div className="space-y-2">
                      {startingAppointments.map((appointment) => (
                        <AppointmentCard
                          key={appointment.id}
                          appointment={appointment}
                          size="md"
                          onClick={() => openAppointmentModal(appointment.id!)}
                          className="border-2 active:scale-95 transition-transform"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
                      <span className="text-sm text-muted-foreground">Available</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}