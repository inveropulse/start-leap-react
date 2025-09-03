import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { format, isSameMonth, isSameDay, isToday } from "date-fns";
import { useCalendarStore } from "../store/calendarStore";
import { PortalType } from "@/shared/types";
import { useAppointmentsByDate } from "../hooks/useCalendarAppointments";
import { AppointmentCard } from "./AppointmentCard";
import { cn } from "@/shared/utils/cn";

interface CalendarGridProps {
  date: Date;
}

export function CalendarGrid({ date }: CalendarGridProps) {
  const { selectedSedationistIds, setSelectedDate, viewMode } = useCalendarStore(PortalType.INTERNAL);
  
  const { appointmentsByDate, isLoading } = useAppointmentsByDate({
    selectedDate: date,
    viewMode,
    selectedSedationistIds,
  });

  // Generate 42 days for consistent 6x7 grid
  const generateCalendarDays = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // First day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    // First day to show (might be from previous month)
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - firstDayOfWeek);
    
    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays(date);

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading calendar...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="h-8 bg-muted rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 42 }).map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{format(date, 'MMMM yyyy')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
              <div 
                key={dayName} 
                className="text-center font-semibold text-sm text-muted-foreground py-2"
              >
                {dayName}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day) => {
              const dayKey = format(day, 'yyyy-MM-dd');
              const appointments = appointmentsByDate[dayKey] || [];
              const isCurrentMonth = isSameMonth(day, date);
              const isSelectedDay = isSameDay(day, date);
              const isDayToday = isToday(day);
              
              return (
                <div
                  key={day.toISOString()}
                  onClick={() => handleDateClick(day)}
                  className={cn(
                    "min-h-[100px] p-2 border rounded-lg cursor-pointer transition-colors",
                    "hover:bg-accent/50",
                    isCurrentMonth ? "bg-background" : "bg-muted/30 text-muted-foreground",
                    isSelectedDay && "ring-2 ring-primary",
                    isDayToday && "bg-primary/10 border-primary/30"
                  )}
                >
                  {/* Date number */}
                  <div className={cn(
                    "text-sm font-medium mb-2",
                    isDayToday && "font-bold text-primary"
                  )}>
                    {format(day, 'd')}
                  </div>

                  {/* Appointments */}
                  {selectedSedationistIds.length > 0 ? (
                    <div className="space-y-1">
                      {appointments.slice(0, 3).map((appointment) => (
                        <AppointmentCard
                          key={appointment.id}
                          appointment={appointment}
                          size="sm"
                          className="h-auto"
                          onClick={() => {
                            // TODO: Open appointment details modal
                            console.log('Open appointment:', appointment.id);
                          }}
                        />
                      ))}
                      
                      {appointments.length > 3 && (
                        <div className="text-xs text-muted-foreground text-center py-1">
                          +{appointments.length - 3} more
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground/50 text-center py-4">
                      {isCurrentMonth ? 'Select sedationists' : ''}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {selectedSedationistIds.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Please select sedationists to view appointments
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}