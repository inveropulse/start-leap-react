import { Button } from "@/shared/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { useCalendarStore } from "../store/calendarStore";
import { PortalType } from "@/shared/types";
import { addDays, addWeeks, subDays, subWeeks, startOfWeek, endOfWeek } from "date-fns";

export function CalendarHeader() {
  const {
    selectedDate,
    setSelectedDate,
    viewMode,
    setViewMode,
  } = useCalendarStore(PortalType.INTERNAL);

  const navigateDate = (direction: 'prev' | 'next') => {
    if (viewMode === "day") {
      const newDate = direction === 'next' ? addDays(selectedDate, 1) : subDays(selectedDate, 1);
      setSelectedDate(newDate);
    } else { // week mode
      const newDate = direction === 'next' ? addWeeks(selectedDate, 1) : subWeeks(selectedDate, 1);
      setSelectedDate(newDate);
    }
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const formatHeaderDate = () => {
    if (viewMode === "day") {
      return selectedDate.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long', 
        day: 'numeric',
        year: 'numeric' 
      });
    } else {
      // Week mode - show week range
      const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday
      const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 }); // Sunday
      
      return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b bg-card">
      {/* Left side - Navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateDate('prev')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateDate('next')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={goToToday}
        >
          Today
        </Button>
      </div>

      {/* Center - Current date */}
      <div className="flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold">
          {formatHeaderDate()}
        </h2>
      </div>

      {/* Right side - View mode toggle */}
      <div className="flex items-center gap-2">
        <Button 
          variant={viewMode === "day" ? "default" : "outline"} 
          size="sm"
          onClick={() => setViewMode("day")}
        >
          Day
        </Button>
        <Button 
          variant={viewMode === "week" ? "default" : "outline"} 
          size="sm"
          onClick={() => setViewMode("week")}
        >
          Week
        </Button>
      </div>
    </div>
  );
}