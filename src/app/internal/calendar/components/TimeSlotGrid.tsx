import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { format } from "date-fns";
import { APP_CONFIG } from "@/shared/AppConfig";
import { useCalendarStore } from "../store/calendarStore";
import { PortalType } from "@/shared/types";
import { useAppointmentsByDate } from "../hooks/useCalendarAppointments";
import { AppointmentCard } from "./AppointmentCard";
import { isAppointmentInTimeSlot } from "../utils/appointmentUtils";

interface TimeSlotGridProps {
  date: Date;
}

export function TimeSlotGrid({ date }: TimeSlotGridProps) {
  const { selectedSedationistIds, sedationists, viewMode } = useCalendarStore(PortalType.INTERNAL);
  
  const selectedSedationistsList = sedationists?.filter(s => 
    selectedSedationistIds.includes(s.id)
  ) || [];
  
  const { appointmentsByDate, eventsData, isLoading } = useAppointmentsByDate({
    selectedDate: date,
    viewMode,
    selectedSedationistIds,
  });

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
  const dateKey = format(date, 'yyyy-MM-dd');

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading appointments...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
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
    <Card>
      <CardHeader>
        <CardTitle>Day Schedule - {formatDate(date)}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[100px_1fr] gap-4">
          {/* Time column header */}
          <div className="font-semibold text-sm text-muted-foreground">
            Time
          </div>
          
          {/* Sedationist headers */}
          <div className={`grid grid-cols-${selectedSedationistsList.length} gap-2`}>
            {selectedSedationistsList.map((sedationist) => (
              <div key={sedationist.id} className="text-center">
                <div className="font-semibold text-sm">
                  {sedationist.firstName} {sedationist.lastName}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDate(date)}
                </div>
              </div>
            ))}
          </div>

          {/* Time slots and appointments */}
          {timeSlots.map((slot) => (
            <div key={slot.time} className="contents">
              {/* Time label */}
              <div className="text-sm text-muted-foreground font-medium py-2">
                {slot.displayTime}
              </div>
              
              {/* Appointment slots for each sedationist */}
              <div className={`grid grid-cols-${selectedSedationistsList.length} gap-2`}>
                {selectedSedationistsList.map((sedationist) => {
                  // Find appointments for this sedationist in this time slot
                  const sedationistEvents = eventsData?.find(e => e.sedationistId === sedationist.id);
                  const appointments = sedationistEvents?.diaryAppointmentEntries?.filter(apt => 
                    isAppointmentInTimeSlot(apt, slot.time, APP_CONFIG.calendar.timeSlotDuration || 60)
                  ) || [];

                  return (
                    <div 
                      key={`${sedationist.id}-${slot.time}`}
                      className="min-h-[60px] border border-dashed border-muted-foreground/20 rounded-sm hover:bg-accent/30 transition-colors"
                    >
                      {appointments.length > 0 ? (
                        <div className="space-y-1 p-1">
                          {appointments.map((appointment) => (
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
      </CardContent>
    </Card>
  );
}