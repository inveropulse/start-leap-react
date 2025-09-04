import { useMemo } from "react";
import {
  useCalendarAppointments,
  useCalendarAvailabilities,
} from "./hooks/useCalendarData";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from "@/shared/components/ui/card";
import { PortalType } from "@/shared/types";
import { startOfDay, endOfDay } from "date-fns";
import { Users, Clock, UserCheck } from "lucide-react";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { TimeSlotGrid } from "./components/TimeSlotGrid";
import { CalendarHeader } from "./components/CalendarHeader";
import { MobileStatsCards } from "./components/mobile/MobileStatsCards";
import { CalendarState, useCalendarStore } from "./store/calendarStore";
import { AppointmentDetailModal } from "./components/AppointmentDetailModal";
import { AvailabilityDetailModal } from "./components/AvailabilityDetailModal";
import { MobileDateNavigation } from "./components/mobile/MobileDateNavigation";
import { MobileSedationistSelect } from "./components/mobile/MobileSedationistSelect";

export default function CalendarPage() {
  const isMobile = useIsMobile();
  const { store, calendarData } = useCalendarData();

  if (store.isLoadingSedationists) {
    return <CalendarLoadingSkeleton />;
  }

  return (
    <div>
      {isMobile ? (
        <CalendarMobilePage store={store} />
      ) : (
        <CalendarDesktopPage store={store} />
      )}

      <CalendarModals store={store} calendarData={calendarData} />
    </div>
  );
}

function CalendarLoadingSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="animate-pulse">
        <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
        <div className="h-32 bg-muted rounded"></div>
      </div>
    </div>
  );
}

function useCalendarData() {
  const store = useCalendarStore(PortalType.INTERNAL);

  const dateRange = useMemo(
    () => ({
      start: startOfDay(store.selectedDate),
      end: endOfDay(store.selectedDate),
    }),
    [store.selectedDate]
  );

  const { data: appointments } = useCalendarAppointments(
    store.selectedSedationistIds,
    dateRange.start,
    dateRange.end
  );

  const { data: availabilities } = useCalendarAvailabilities(
    store.selectedSedationistIds,
    dateRange.start,
    dateRange.end
  );

  const selectedAppointment =
    appointments?.find((apt) => apt.id === store.selectedAppointmentId) || null;

  const selectedAvailability =
    availabilities?.find(
      (avail) => avail.id === store.selectedAvailabilityId
    ) || null;

  return {
    store,
    calendarData: {
      appointments,
      availabilities,
      selectedAppointment,
      selectedAvailability,
    },
  };
}

function CalendarModals({
  store,
  calendarData,
}: ReturnType<typeof useCalendarData>) {
  return (
    <>
      <AppointmentDetailModal
        isOpen={store.isAppointmentModalOpen}
        onClose={store.closeAppointmentModal}
        appointment={calendarData.selectedAppointment}
      />

      <AvailabilityDetailModal
        isOpen={store.isAvailabilityModalOpen}
        onClose={store.closeAvailabilityModal}
        availability={calendarData.selectedAvailability}
      />
    </>
  );
}

interface CalendarMobilePageProps {
  store: CalendarState;
}
function CalendarMobilePage({ store }: CalendarMobilePageProps) {
  return (
    <div className="flex flex-col h-full overflow-x-hidden px-4">
      {/* Page Header */}
      <div className="text-center py-4">
        <h1 className="text-xl font-bold">Calendar</h1>
        <p className="text-sm text-muted-foreground">
          Manage schedules and appointments
        </p>
      </div>

      {/* Mobile Sedationist Selector */}
      <div className="pb-4">
        <MobileSedationistSelect />
      </div>

      {/* Mobile Stats Cards */}
      <div className="pb-4">
        <MobileStatsCards />
      </div>

      {/* Mobile Date Navigation */}
      <MobileDateNavigation />

      {/* Main Calendar Area */}
      <div className="flex-1 pb-6">
        <TimeSlotGrid date={store.selectedDate} />
      </div>
    </div>
  );
}

interface CalendarDesktopPageProps {
  store: CalendarState;
}
function CalendarDesktopPage({ store }: CalendarDesktopPageProps) {
  return (
    <div className="flex flex-col h-full overflow-x-hidden px-6">
      {/* Page Header */}
      <div className="flex justify-center py-6 pb-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">
            Manage sedationist schedules and appointments
          </p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="pb-4">
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
                {store.selectedSedationistIds.length}
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
                {store.sedationists?.length || 0}
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
              <div className="text-2xl font-bold capitalize">
                {store.viewMode}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {store.selectedDate.toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Calendar Header with navigation */}
      <CalendarHeader />

      {/* Main Calendar Area */}
      <div className="flex-1 pb-6">
        <TimeSlotGrid date={store.selectedDate} />
      </div>
    </div>
  );
}
