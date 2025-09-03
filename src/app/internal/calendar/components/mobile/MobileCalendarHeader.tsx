import { Button } from "@/shared/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useCalendarStore } from "../../store/calendarStore";
import { PortalType } from "@/shared/types";
import { addDays, subDays } from "date-fns";
import { useSwipeGestures } from "../../hooks/useSwipeGestures";

export function MobileCalendarHeader() {
  const { selectedDate, setSelectedDate } = useCalendarStore(PortalType.INTERNAL);

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = direction === "next" 
      ? addDays(selectedDate, 1) 
      : subDays(selectedDate, 1);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const swipeRef = useSwipeGestures({
    onSwipeLeft: () => navigateDate("next"),
    onSwipeRight: () => navigateDate("prev"),
  });

  const formatHeaderDate = () => {
    return selectedDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const isToday = () => {
    const today = new Date();
    return selectedDate.toDateString() === today.toDateString();
  };

  return (
    <div 
      ref={swipeRef}
      className="flex items-center justify-between px-4 py-3 bg-background border-b"
    >
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigateDate("prev")}
        className="h-9 w-9"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-semibold text-foreground">
            {formatHeaderDate()}
          </h2>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Swipe to navigate dates
        </p>
        {!isToday() && (
          <Button
            variant="ghost"
            size="sm"
            onClick={goToToday}
            className="text-xs text-muted-foreground h-6 px-2 mt-1"
          >
            Go to Today
          </Button>
        )}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => navigateDate("next")}
        className="h-9 w-9"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}