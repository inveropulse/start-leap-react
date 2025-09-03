import { Card, CardContent } from "@/shared/components/ui/card";
import { useCalendarStore } from "../store/calendarStore";
import { PortalType } from "@/shared/types";
import { APP_CONFIG } from "@/shared/AppConfig";

interface TimeSlotGridProps {
  date: Date;
}

export function TimeSlotGrid({ date }: TimeSlotGridProps) {
  const {
    selectedSedationistIds,
    sedationists,
  } = useCalendarStore(PortalType.INTERNAL);

  const selectedSedationistsList = sedationists?.filter(s => 
    selectedSedationistIds.includes(s.id)
  ) || [];

  // Generate time slots based on app config
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = APP_CONFIG.calendar.defaultStartHour;
    const endHour = APP_CONFIG.calendar.defaultEndHour;
    const slotDuration = APP_CONFIG.calendar.timeSlotDuration;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minutes = 0; minutes < 60; minutes += slotDuration) {
        const time = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        slots.push({ time, hour, minutes });
      }
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-[120px_1fr] min-h-[600px]">
          {/* Time column */}
          <div className="bg-muted/20 border-r">
            <div className="h-12 border-b bg-muted/30 flex items-center justify-center font-medium text-sm">
              Time
            </div>
            <div className="space-y-0">
              {timeSlots.map((slot, index) => (
                <div 
                  key={`${slot.hour}-${slot.minutes}`}
                  className={`h-12 flex items-center justify-center text-xs text-muted-foreground border-b border-muted/30 ${
                    slot.minutes === 0 ? 'font-medium' : ''
                  }`}
                >
                  {slot.minutes === 0 ? slot.time : ''}
                </div>
              ))}
            </div>
          </div>

          {/* Calendar content */}
          <div className="flex-1">
            {selectedSedationistsList.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <div className="text-muted-foreground mb-2">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/30 flex items-center justify-center">
                      📅
                    </div>
                  </div>
                  <h3 className="font-medium mb-1">No sedationists selected</h3>
                  <p className="text-sm text-muted-foreground">
                    Select sedationists from the filter to view their schedules
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid" style={{ gridTemplateColumns: `repeat(${selectedSedationistsList.length}, 1fr)` }}>
                {/* Headers for each sedationist */}
                {selectedSedationistsList.map((sedationist) => (
                  <div 
                    key={`header-${sedationist.id}`}
                    className="h-12 border-b border-r border-muted/30 bg-muted/10 flex items-center justify-center font-medium text-sm px-2"
                  >
                    <div className="text-center">
                      <div className="truncate">
                        {sedationist.firstName} {sedationist.lastName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(date)}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Time slots for each sedationist */}
                {timeSlots.map((slot, timeIndex) => 
                  selectedSedationistsList.map((sedationist, sedIndex) => (
                    <div
                      key={`${sedationist.id}-${slot.hour}-${slot.minutes}`}
                      className="h-12 border-b border-r border-muted/30 hover:bg-muted/20 cursor-pointer transition-colors relative group"
                    >
                      {/* Placeholder for appointments - will be populated in Phase 4 */}
                      <div className="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-50 text-xs text-muted-foreground">
                        +
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}