import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, startOfDay, endOfDay } from "date-fns";
import { APP_CONFIG } from "@/shared/AppConfig";
import { useCalendarStore } from "../store/calendarStore";
import { PortalType } from "@/shared/types";
import { useCalendarAppointments, useCalendarAvailabilities } from "../hooks/useCalendarData";
import { AppointmentCard } from "./AppointmentCard";
import { AvailabilityCard } from "./AvailabilityCard";
import { isAppointmentInTimeSlot, isAppointmentStartInSlot, isAppointmentContinuation, formatPatientName } from "../utils/appointmentUtils";
import { isAvailabilityInTimeSlot, isAvailabilityStartInSlot, isAvailabilityContinuation } from "../utils/availabilityUtils";

interface WeekSlotGridProps {
  date: Date;
}

export function WeekSlotGrid({ date }: WeekSlotGridProps) {
  const { selectedSedationistIds, sedationists, openAppointmentModal, openAvailabilityModal } = useCalendarStore(PortalType.INTERNAL);
  
  const selectedSedationistsList = sedationists?.filter(s => 
    selectedSedationistIds.includes(s.id!)
  ) || [];

  // Get week range
  const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Monday start
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  // Fetch appointments and availabilities for the entire week
  const { data: appointments, isLoading: isLoadingAppointments } = useCalendarAppointments(
    selectedSedationistIds,
    startOfDay(weekStart),
    endOfDay(weekEnd)
  );

  const { data: availabilities, isLoading: isLoadingAvailabilities } = useCalendarAvailabilities(
    selectedSedationistIds,
    startOfDay(weekStart),
    endOfDay(weekEnd)
  );

  const isLoading = isLoadingAppointments || isLoadingAvailabilities;

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
  const formatWeekRange = (start: Date, end: Date) => 
    `${format(start, 'MMM dd')} - ${format(end, 'MMM dd, yyyy')}`;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading week schedule...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 12 }).map((_, i) => (
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
          <CardTitle>Week Schedule - {formatWeekRange(weekStart, weekEnd)}</CardTitle>
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

  // Group appointments by date and sedationist for easier lookup
  const appointmentsByDateAndSedationist = appointments?.reduce((acc, apt) => {
    const dateKey = format(new Date(apt.start!), 'yyyy-MM-dd');
    const sedationistId = apt.sedationistId!;
    const key = `${dateKey}-${sedationistId}`;
    
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(apt);
    return acc;
  }, {} as Record<string, typeof appointments>) || {};

  // Group availabilities by date and sedationist for easier lookup
  const availabilitiesByDateAndSedationist = availabilities?.reduce((acc, avail) => {
    const dateKey = format(new Date(avail.start!), 'yyyy-MM-dd');
    const sedationistId = avail.sedationistId!;
    const key = `${dateKey}-${sedationistId}`;
    
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(avail);
    return acc;
  }, {} as Record<string, typeof availabilities>) || {};

  const handleAppointmentClick = (appointmentId: string) => {
    openAppointmentModal(appointmentId);
  };

  const handleAvailabilityClick = (availabilityId: string) => {
    openAvailabilityModal(availabilityId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Week Schedule - {formatWeekRange(weekStart, weekEnd)}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div 
            className="flex flex-col gap-4" 
            style={{ minWidth: `${(weekDays.length * selectedSedationistsList.length * 180) + 100}px` }}
          >
            {/* Header with days and sedationists */}
            <div className="flex gap-2">
              <div className="w-[100px] font-semibold text-sm text-muted-foreground">
                Time
              </div>
              
              {weekDays.map((day) => (
                <div key={day.toISOString()} className="flex-1">
                  <div className="text-center font-semibold text-sm mb-2">
                    {format(day, 'EEE dd/MM')}
                  </div>
                  <div className="flex gap-1">
                    {selectedSedationistsList.map((sedationist) => (
                      <div key={sedationist.id} className="flex-1 min-w-[180px] text-center">
                        <div className="text-xs text-muted-foreground">
                          {sedationist.firstName} {sedationist.lastName}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Time slots and appointments */}
            <div className="space-y-0">
              {timeSlots.map((slot) => (
                <div key={slot.time} className="flex gap-2">
                  {/* Time label */}
                  <div className="w-[100px] text-sm text-muted-foreground font-medium py-2">
                    {slot.displayTime}
                  </div>
                  
                  {/* Days and sedationists grid */}
                  {weekDays.map((day) => (
                    <div key={day.toISOString()} className="flex-1 flex gap-1">
                      {selectedSedationistsList.map((sedationist) => {
                        const dateKey = format(day, 'yyyy-MM-dd');
                        const appointmentKey = `${dateKey}-${sedationist.id}`;
                        const dayAppointments = appointmentsByDateAndSedationist[appointmentKey] || [];
                        const dayAvailabilities = availabilitiesByDateAndSedationist[appointmentKey] || [];
                        
                        // Find appointments for this sedationist in this time slot
                        const slotAppointments = dayAppointments.filter(apt => 
                          isAppointmentInTimeSlot(apt, slot.time, APP_CONFIG.calendar.timeSlotDuration || 60)
                        );

                        // Find availabilities for this sedationist in this time slot
                        const slotAvailabilities = dayAvailabilities.filter(avail => 
                          isAvailabilityInTimeSlot(avail, slot.time, APP_CONFIG.calendar.timeSlotDuration || 60)
                        );

                        // Separate appointments that start in this slot vs continuations
                        const startingAppointments = slotAppointments.filter(apt => 
                          isAppointmentStartInSlot(apt, slot.time, APP_CONFIG.calendar.timeSlotDuration || 60)
                        );
                        
                        const continuationAppointments = slotAppointments.filter(apt => 
                          isAppointmentContinuation(apt, slot.time, APP_CONFIG.calendar.timeSlotDuration || 60)
                        );

                        // Separate availabilities that start in this slot vs continuations
                        const startingAvailabilities = slotAvailabilities.filter(avail => 
                          isAvailabilityStartInSlot(avail, slot.time, APP_CONFIG.calendar.timeSlotDuration || 60)
                        );
                        
                        const continuationAvailabilities = slotAvailabilities.filter(avail => 
                          isAvailabilityContinuation(avail, slot.time, APP_CONFIG.calendar.timeSlotDuration || 60)
                        );

                        const hasContent = startingAppointments.length > 0 || continuationAppointments.length > 0 || startingAvailabilities.length > 0 || continuationAvailabilities.length > 0;

                        return (
                          <div 
                            key={`${sedationist.id}-${slot.time}-${dateKey}`}
                            className="flex-1 min-w-[180px] min-h-[60px] border border-dashed border-muted-foreground/20 rounded-sm hover:bg-accent/30 transition-colors"
                          >
                            {hasContent ? (
                              <div className="space-y-1 p-1">
                                {/* Starting appointments */}
                                {startingAppointments.map((appointment) => (
                                  <AppointmentCard
                                    key={appointment.id}
                                    appointment={appointment}
                                    size="sm"
                                    onClick={() => handleAppointmentClick(appointment.id!)}
                                  />
                                ))}
                                
                                {/* Starting availabilities */}
                                {startingAvailabilities.map((availability) => (
                                  <AvailabilityCard
                                    key={availability.id}
                                    availability={availability}
                                    size="sm"
                                    onClick={() => handleAvailabilityClick(availability.id!)}
                                  />
                                ))}
                                
                                {/* Continuation appointments */}
                                {continuationAppointments.map((appointment) => (
                                  <div
                                    key={`${appointment.id}-continuation`}
                                    className="w-full h-6 bg-primary/20 border-l-4 border-primary rounded-sm flex items-center justify-center text-xs text-primary font-medium cursor-pointer hover:bg-primary/30 transition-colors"
                                    onClick={() => handleAppointmentClick(appointment.id!)}
                                  >
                                    {formatPatientName(appointment)}
                                  </div>
                                ))}
                                
                                {/* Continuation availabilities */}
                                {continuationAvailabilities.map((availability) => (
                                  <div
                                    key={`${availability.id}-continuation`}
                                    className="w-full h-6 bg-purple-200 border-l-4 border-purple-500 rounded-sm flex items-center justify-center text-xs text-purple-700 font-medium cursor-pointer hover:bg-purple-300 dark:bg-purple-900/50 dark:text-purple-300"
                                    onClick={() => handleAvailabilityClick(availability.id!)}
                                  >
                                    {availability.sedationistName}
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
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}