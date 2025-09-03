import { Button } from "@/shared/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { useCalendarStore } from "../store/calendarStore";
import { PortalType } from "@/shared/types";
import { addDays, subDays } from "date-fns";

export function CalendarHeader() {
  const { selectedDate, setSelectedDate } = useCalendarStore(
    PortalType.INTERNAL
  );

  const navigateDate = (direction: "prev" | "next") => {
    const newDate =
      direction === "next"
        ? addDays(selectedDate, 1)
        : subDays(selectedDate, 1);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const formatHeaderDate = () => {
    return selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex items-center justify-between py-4 bg-card">
      {/* Left side - Navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateDate("prev")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateDate("next")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="sm" onClick={goToToday}>
          Today
        </Button>
      </div>

      {/* Center - Current date */}
      <div className="flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold">{formatHeaderDate()}</h2>
      </div>

      {/* Right side - Day view only */}
      <div className="flex items-center">
        <Button variant="default" size="sm" disabled>
          Day View
        </Button>
      </div>
    </div>
  );
}
