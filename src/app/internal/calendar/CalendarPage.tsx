import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Calendar, Users, Clock } from "lucide-react";
import { PortalType } from "@/shared/types";
import { useCalendarStore } from "./store/calendarStore";

export default function CalendarPage() {
  const {
    setPortal,
    loadPersistedState,
    selectedSedationistIds,
    viewMode,
    selectedDate,
    sedationists,
    isLoadingSedationists
  } = useCalendarStore(PortalType.INTERNAL);

  // Initialize calendar for internal portal
  useEffect(() => {
    setPortal(PortalType.INTERNAL);
    loadPersistedState(PortalType.INTERNAL);
  }, [setPortal, loadPersistedState]);

  if (isLoadingSedationists) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">
            Manage sedationist schedules and appointments
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Available Sedationists
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sedationists?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Ready for scheduling
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Selected Sedationists
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedSedationistIds.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently viewing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              View Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{viewMode}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {selectedDate.toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Calendar Area - Placeholder for now */}
      <Card>
        <CardHeader>
          <CardTitle>Calendar View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Calendar Features Coming Soon</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              The calendar interface is being built. You can see the persistent storage working - 
              your selected sedationists ({selectedSedationistIds.length}) and view mode ({viewMode}) 
              are saved securely for the Internal portal.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}