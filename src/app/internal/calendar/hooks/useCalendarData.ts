import { useQuery } from "@tanstack/react-query";
import { mockSedationists, generateMockAppointments } from "../services/mockCalendarData";
import { SedationistDto } from "@/api/generated/models/SedationistDto";
import { DiaryAppointmentDto } from "@/api/generated/models/DiaryAppointmentDto";

// Hook to fetch all sedationists with extended cache time
export const useSedationists = () => {
  return useQuery({
    queryKey: ["sedationists"],
    queryFn: async (): Promise<SedationistDto[]> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockSedationists;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

// Hook to fetch appointments for specific sedationists and date range  
export const useCalendarAppointments = (
  sedationistIds: string[],
  startDate: Date,
  endDate: Date
) => {
  return useQuery({
    queryKey: ["calendar-appointments", sedationistIds, startDate.toISOString(), endDate.toISOString()],
    queryFn: async (): Promise<DiaryAppointmentDto[]> => {
      // Simulate API delay for realistic UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (sedationistIds.length === 0) {
        return [];
      }
      
      return generateMockAppointments(startDate, endDate, sedationistIds);
    },
    enabled: sedationistIds.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes - shorter for demo
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};