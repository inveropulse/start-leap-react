import { Card, CardContent } from "@/shared/components/ui/card";
import { useCalendarStore } from "../store/calendarStore";
import { PortalType } from "@/shared/types";

interface CalendarGridProps {
  date: Date;
}

export function CalendarGrid({ date }: CalendarGridProps) {
  const {
    selectedSedationistIds,
    sedationists,
    setSelectedDate,
  } = useCalendarStore(PortalType.INTERNAL);

  const selectedSedationistsList = sedationists?.filter(s => 
    selectedSedationistIds.includes(s.id)
  ) || [];

  // Generate calendar days for the month
  const generateCalendarDays = () => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    // Generate 42 days (6 weeks) for consistent grid
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const today = new Date();
  const currentMonth = date.getMonth();

  const isToday = (day: Date) => {
    return day.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (day: Date) => {
    return day.getMonth() === currentMonth;
  };

  const isSelected = (day: Date) => {
    return day.toDateString() === date.toDateString();
  };

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {dayNames.map((dayName) => (
            <div 
              key={dayName}
              className="h-10 flex items-center justify-center font-medium text-sm text-muted-foreground border-b"
            >
              {dayName}
            </div>
          ))}

          {/* Calendar days */}
          {calendarDays.map((day, index) => {
            const dayNumber = day.getDate();
            const isCurrentMonthDay = isCurrentMonth(day);
            const isTodayDay = isToday(day);
            const isSelectedDay = isSelected(day);
            
            return (
              <div
                key={index}
                onClick={() => handleDateClick(day)}
                className={`
                  h-24 p-1 border border-muted/30 cursor-pointer transition-colors hover:bg-muted/20
                  ${!isCurrentMonthDay ? 'bg-muted/5 text-muted-foreground/50' : 'bg-background'}
                  ${isTodayDay ? 'bg-primary/10 border-primary/30' : ''}
                  ${isSelectedDay ? 'bg-primary/20 border-primary' : ''}
                `}
              >
                <div className="w-full h-full flex flex-col">
                  {/* Day number */}
                  <div className={`
                    text-sm font-medium mb-1
                    ${isTodayDay ? 'text-primary' : ''}
                    ${isSelectedDay ? 'text-primary font-bold' : ''}
                    ${!isCurrentMonthDay ? 'text-muted-foreground/50' : ''}
                  `}>
                    {dayNumber}
                  </div>

                  {/* Appointment indicators */}
                  <div className="flex-1 space-y-1">
                    {selectedSedationistsList.length > 0 && isCurrentMonthDay && (
                      <div className="space-y-1">
                        {selectedSedationistsList.slice(0, 3).map((sedationist, idx) => (
                          <div 
                            key={sedationist.id}
                            className="h-1 bg-primary/60 rounded-full"
                            style={{ width: `${80 - idx * 10}%` }}
                          />
                        ))}
                        {selectedSedationistsList.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{selectedSedationistsList.length - 3} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {selectedSedationistsList.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/30 flex items-center justify-center">
                📅
              </div>
              <h3 className="font-medium mb-1">No sedationists selected</h3>
              <p className="text-sm text-muted-foreground">
                Select sedationists from the filter to view appointments
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}