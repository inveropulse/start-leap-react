import { useQuery } from "@tanstack/react-query";
import { DiaryService } from "@/api/generated/services/DiaryService";
import { SedationistDiaryEventsDto } from "@/api/generated/models/SedationistDiaryEventsDto";
import { DiaryAppointmentDto } from "@/api/generated/models/DiaryAppointmentDto";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfDay, endOfDay } from "date-fns";
import { useAxiosClient } from "@/shared/providers/AxiosClientProvider";
import { useMemo } from "react";

export interface UseCalendarAppointmentsOptions {
  selectedDate: Date;
  viewMode: "day" | "week" | "month";
  selectedSedationistIds: string[];
  enabled?: boolean;
}

export function useCalendarAppointments({
  selectedDate,
  viewMode,
  selectedSedationistIds,
  enabled = true,
}: UseCalendarAppointmentsOptions) {
  const { apiClient } = useAxiosClient();

  const getDateRange = () => {
    let startDate: Date;
    let endDate: Date;

    switch (viewMode) {
      case "day":
        startDate = startOfDay(selectedDate);
        endDate = endOfDay(selectedDate);
        break;
      case "week":
        startDate = startOfWeek(selectedDate);
        endDate = endOfWeek(selectedDate);
        break;
      case "month":
        // For month view, get a wider range to include partial weeks
        const monthStart = startOfMonth(selectedDate);
        const monthEnd = endOfMonth(selectedDate);
        startDate = startOfWeek(monthStart);
        endDate = endOfWeek(monthEnd);
        break;
      default:
        startDate = startOfDay(selectedDate);
        endDate = endOfDay(selectedDate);
    }

    return {
      fromDate: format(startDate, "yyyy-MM-dd"),
      toDate: format(endDate, "yyyy-MM-dd"),
    };
  };

  const { fromDate, toDate } = getDateRange();

  return useQuery({
    queryKey: ["calendar-appointments", selectedSedationistIds, fromDate, toDate, viewMode],
    queryFn: async (): Promise<SedationistDiaryEventsDto[]> => {
      if (selectedSedationistIds.length === 0) {
        return [];
      }

      const response = await apiClient.diary.getApiDiaryDiaryAppointments(
        selectedSedationistIds,
        fromDate,
        toDate
      );

      return response.data || [];
    },
    enabled: enabled && selectedSedationistIds.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

// Helper hook to get flattened appointments by date
export function useAppointmentsByDate({
  selectedDate,
  viewMode,
  selectedSedationistIds,
}: UseCalendarAppointmentsOptions) {
  const { data: eventsData, isLoading, error } = useCalendarAppointments({
    selectedDate,
    viewMode,
    selectedSedationistIds,
  });

  const appointmentsByDate = useMemo(() => {
    const dateMap: Record<string, DiaryAppointmentDto[]> = {};

    eventsData?.forEach((sedationistData) => {
      sedationistData.diaryAppointmentEntries?.forEach((appointment) => {
        if (appointment.start) {
          const appointmentDate = format(new Date(appointment.start), "yyyy-MM-dd");
          if (!dateMap[appointmentDate]) {
            dateMap[appointmentDate] = [];
          }
          dateMap[appointmentDate].push(appointment);
        }
      });
    });

    // Sort appointments by start time for each date
    Object.keys(dateMap).forEach((date) => {
      dateMap[date].sort((a, b) => {
        const timeA = a.start ? new Date(a.start).getTime() : 0;
        const timeB = b.start ? new Date(b.start).getTime() : 0;
        return timeA - timeB;
      });
    });

    return dateMap;
  }, [eventsData]);

  return {
    appointmentsByDate,
    eventsData,
    isLoading,
    error,
  };
}