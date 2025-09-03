import { useQuery } from "@tanstack/react-query";
import { mockSedationists, generateMockAppointments, generateMockAvailabilities } from "../services/mockCalendarData";
import { SedationistDto } from "@/api/generated/models/SedationistDto";
import { DiaryAppointmentDto } from "@/api/generated/models/DiaryAppointmentDto";
import { DiaryAvailabilityDto } from "@/api/generated/models/DiaryAvailabilityDto";

// Hook to fetch all sedationists with extended cache time
export const useSedationists = () => {
  return useQuery({
    queryKey: ["sedationists"],
    queryFn: async (): Promise<SedationistDto[]> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockSedationists;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - reduced for testing
    gcTime: 10 * 60 * 1000, // 10 minutes
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

// Hook to fetch availabilities for specific sedationists and date range
export const useCalendarAvailabilities = (
  sedationistIds: string[],
  startDate: Date,
  endDate: Date
) => {
  return useQuery({
    queryKey: ["calendar-availabilities", sedationistIds, startDate.toISOString(), endDate.toISOString()],
    queryFn: async (): Promise<DiaryAvailabilityDto[]> => {
      // Simulate API delay for realistic UX
      await new Promise(resolve => setTimeout(resolve, 600));
      
      if (sedationistIds.length === 0) {
        return [];
      }
      
      return generateMockAvailabilities(startDate, endDate, sedationistIds);
    },
    enabled: sedationistIds.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes - shorter for demo
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};