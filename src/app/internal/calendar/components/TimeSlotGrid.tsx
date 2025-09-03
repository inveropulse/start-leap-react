import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { format, startOfDay, endOfDay } from "date-fns";
import { APP_CONFIG } from "@/shared/AppConfig";
import { useCalendarStore } from "../store/calendarStore";
import { PortalType } from "@/shared/types";
import { useCalendarAppointments } from "../hooks/useCalendarData";
import { AppointmentCard } from "./AppointmentCard";
import { isAppointmentInTimeSlot, isAppointmentStartInSlot, isAppointmentContinuation, formatPatientName } from "../utils/appointmentUtils";

interface TimeSlotGridProps {
  date: Date;
}

export function TimeSlotGrid({ date }: TimeSlotGridProps) {
  const { selectedSedationistIds, sedationists } = useCalendarStore(PortalType.INTERNAL);
  
  const selectedSedationistsList = sedationists?.filter(s => 
    selectedSedationistIds.includes(s.id!)
  ) || [];
  
  // Use mock data hook instead of API
  const { data: appointments, isLoading } = useCalendarAppointments(
    selectedSedationistIds,
    startOfDay(date),
    endOfDay(date)
  );

  // Generate time slots from config
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
  const formatDate = (date: Date) => format(date, 'MMM dd, yyyy');

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading appointments...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (selectedSedationistsList.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Day Schedule - {formatDate(date)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Please select sedationists to view their schedules
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-full">
      <CardHeader>
        <CardTitle>Day Schedule - {formatDate(date)}</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="flex flex-col gap-4" style={{ minWidth: `${selectedSedationistsList.length * 200 + 120}px` }}>
          {/* Header with fixed time column and scrollable sedationist columns */}
          <div className="flex gap-4">
            <div className="w-[100px] flex-shrink-0 font-semibold text-sm text-muted-foreground">
              Time
            </div>
            
            {/* Sedationist headers */}
            <div className="flex gap-2">
              {selectedSedationistsList.map((sedationist) => (
                <div key={sedationist.id} className="flex-shrink-0 w-[200px] text-center">
                  <div className="font-semibold text-sm">
                    {sedationist.firstName} {sedationist.lastName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(date)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Time slots and appointments */}
          <div className="space-y-0">
            {timeSlots.map((slot) => (
              <div key={slot.time} className="flex gap-4">
                {/* Time label */}
                <div className="w-[100px] flex-shrink-0 text-sm text-muted-foreground font-medium py-2">
                  {slot.displayTime}
                </div>
                
                {/* Appointment slots */}
                <div className="flex gap-2">
                  {selectedSedationistsList.map((sedationist) => {
                    // Find appointments for this sedationist in this time slot
                    const sedationistAppointments = appointments?.filter(apt => 
                      apt.sedationistId === sedationist.id &&
                      isAppointmentInTimeSlot(apt, slot.time, APP_CONFIG.calendar.timeSlotDuration || 60)
                    ) || [];

                    // Separate appointments that start in this slot vs continuations
                    const startingAppointments = sedationistAppointments.filter(apt => 
                      isAppointmentStartInSlot(apt, slot.time, APP_CONFIG.calendar.timeSlotDuration || 60)
                    );
                    
                    const continuationAppointments = sedationistAppointments.filter(apt => 
                      isAppointmentContinuation(apt, slot.time, APP_CONFIG.calendar.timeSlotDuration || 60)
                    );

                    return (
                      <div 
                        key={`${sedationist.id}-${slot.time}`}
                        className="flex-shrink-0 w-[200px] min-h-[60px] border border-dashed border-muted-foreground/20 rounded-sm hover:bg-accent/30 transition-colors"
                      >
                        {startingAppointments.length > 0 ? (
                          <div className="space-y-1 p-1">
                            {startingAppointments.map((appointment) => (
                              <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                                size="sm"
                                onClick={() => {
                                  // TODO: Open appointment details modal
                                  console.log('Open appointment:', appointment.id);
                                }}
                              />
                            ))}
                          </div>
                        ) : continuationAppointments.length > 0 ? (
                          <div className="h-full flex items-center justify-center p-1">
                            {continuationAppointments.map((appointment) => (
                              <div
                                key={`${appointment.id}-continuation`}
                                className="w-full h-full bg-primary/20 border-l-4 border-primary rounded-sm flex items-center justify-center text-xs text-primary font-medium"
                              >
                                {formatPatientName(appointment)}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center text-xs text-muted-foreground/50">
                            Available
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}