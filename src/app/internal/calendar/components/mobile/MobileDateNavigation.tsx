import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useCalendarStore } from "../../store/calendarStore";
import { PortalType } from "@/shared/types";
import { addDays, subDays, format } from "date-fns";

export function MobileDateNavigation() {
  const { selectedDate, setSelectedDate } = useCalendarStore(PortalType.INTERNAL);

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = direction === "next" 
      ? addDays(selectedDate, 1) 
      : subDays(selectedDate, 1);
    setSelectedDate(newDate);
  };

  const formatDate = () => {
    return format(selectedDate, "EEE, MMM d");
  };

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <div className="flex items-center justify-between w-full max-w-xs">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateDate("prev")}
          className="h-10 w-10 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="text-center">
          <div className="text-lg font-semibold">{formatDate()}</div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateDate("next")}
          className="h-10 w-10 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground">
        Swipe to navigate dates
      </p>
    </div>
  );
}