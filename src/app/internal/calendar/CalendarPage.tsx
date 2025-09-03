import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Users, Clock, UserCheck } from "lucide-react";
import { PortalType } from "@/shared/types";
import { useCalendarStore } from "./store/calendarStore";
import { CalendarHeader } from "./components/CalendarHeader";
import { SedationistMultiSelect } from "./components/SedationistMultiSelect";
import { TimeSlotGrid } from "./components/TimeSlotGrid";
import { AppointmentDetailModal } from "./components/AppointmentDetailModal";
import { useCalendarAppointments } from "./hooks/useCalendarData";
import { startOfDay, endOfDay } from "date-fns";

export default function CalendarPage() {
  const {
    setPortal,
    loadPersistedState,
    selectedSedationistIds,
    viewMode,
    selectedDate,
    sedationists,
    isLoadingSedationists,
    selectedAppointmentId,
    isAppointmentModalOpen,
    closeAppointmentModal,
  } = useCalendarStore(PortalType.INTERNAL);

  // Initialize calendar for internal portal
  useEffect(() => {
    setPortal(PortalType.INTERNAL);
    loadPersistedState(PortalType.INTERNAL);
  }, [setPortal, loadPersistedState]);

  // Get appointment data for modal
  const { data: appointments } = useCalendarAppointments(
    selectedSedationistIds,
    startOfDay(selectedDate),
    endOfDay(selectedDate)
  );

  const selectedAppointment =
    appointments?.find((apt) => apt.id === selectedAppointmentId) || null;

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
    <div className="flex flex-col h-full overflow-x-hidden">
      {/* Page Header */}
      <div className="flex justify-center p-6 pb-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">
            Manage sedationist schedules and appointments
          </p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="px-6 pb-4">
        <div className="flex items-center gap-4 mb-4">
          <SedationistMultiSelect />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Selected Sedationists
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {selectedSedationistIds.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Currently selected
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Available Sedationists
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sedationists?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ready for scheduling
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
      </div>

      {/* Calendar Header with navigation */}
      <CalendarHeader />

      {/* Main Calendar Area */}
      <div className="flex-1 px-6 pb-6">
        <TimeSlotGrid date={selectedDate} />
      </div>

      {/* Appointment Detail Modal */}
      <AppointmentDetailModal
        isOpen={isAppointmentModalOpen}
        onClose={closeAppointmentModal}
        appointment={selectedAppointment}
      />
    </div>
  );
}
