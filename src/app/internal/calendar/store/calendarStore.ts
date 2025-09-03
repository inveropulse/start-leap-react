import { create } from "zustand";
import { useQuery } from "@tanstack/react-query";
import { PortalType } from "@/shared/types";
import { calendarStorage } from "@/shared/services/storage/CalendarStorageService";
import { SedationistDto } from "@/api/generated/models/SedationistDto";
import { mockSedationists } from "../services/mockCalendarData";

export interface CalendarState {
  // Portal context
  portal: PortalType;
  
  // View state
  viewMode: "day";
  selectedDate: Date;
  
  // Sedationist data
  sedationists: SedationistDto[];
  selectedSedationistIds: string[];
  
  // UI state
  isLoading: boolean;
  isLoadingSedationists: boolean;
  
  // Actions
  setPortal: (portal: PortalType) => void;
  setSelectedDate: (date: Date) => void;
  setSelectedSedationists: (ids: string[]) => void;
  addSedationist: (id: string) => void;
  removeSedationist: (id: string) => void;
  clearSedationists: () => void;
  setLoading: (loading: boolean) => void;
  setSedationists: (sedationists: SedationistDto[]) => void;
  setLoadingSedationists: (loading: boolean) => void;
  
  // Persistence
  loadPersistedState: (portal: PortalType) => void;
  clearPortalData: () => void;
}

// Portal-specific store instances
const storeInstances = new Map<PortalType, any>();

const createCalendarStore = (portal: PortalType) => {
  return create<CalendarState>((set, get) => ({
    // Initial state
    portal,
    viewMode: "day",
    selectedDate: new Date(),
    sedationists: [],
    selectedSedationistIds: [],
    isLoading: false,
    isLoadingSedationists: false,

    // Actions
    setPortal: (newPortal: PortalType) => {
      set({ portal: newPortal });
      get().loadPersistedState(newPortal);
    },


    setSelectedDate: (date: Date) => {
      const { portal } = get();
      calendarStorage.setSelectedDate(portal, date);
      set({ selectedDate: date });
    },

    setSelectedSedationists: (ids: string[]) => {
      const { portal } = get();
      calendarStorage.setSelectedSedationists(portal, ids);
      set({ selectedSedationistIds: ids });
    },

    addSedationist: (id: string) => {
      const { selectedSedationistIds } = get();
      if (!selectedSedationistIds.includes(id)) {
        const newIds = [...selectedSedationistIds, id];
        get().setSelectedSedationists(newIds);
      }
    },

    removeSedationist: (id: string) => {
      const { selectedSedationistIds } = get();
      const newIds = selectedSedationistIds.filter(sid => sid !== id);
      get().setSelectedSedationists(newIds);
    },

    clearSedationists: () => {
      get().setSelectedSedationists([]);
    },

    setLoading: (loading: boolean) => {
      set({ isLoading: loading });
    },

    setSedationists: (sedationists: SedationistDto[]) => {
      set({ sedationists });
    },

    setLoadingSedationists: (loading: boolean) => {
      set({ isLoadingSedationists: loading });
    },

    // Persistence
    loadPersistedState: (targetPortal: PortalType) => {
      const selectedDate = calendarStorage.getSelectedDate(targetPortal);
      const selectedSedationistIds = calendarStorage.getSelectedSedationists(targetPortal);

      set({
        viewMode: "day", // Always day view now
        selectedDate,
        selectedSedationistIds,
      });
    },

    clearPortalData: () => {
      const { portal } = get();
      calendarStorage.clearPortalData(portal);
      set({
        viewMode: "day",
        selectedDate: new Date(),
        selectedSedationistIds: [],
      });
    },
  }));
};

// Get or create store instance for specific portal
const getCalendarStore = (portal: PortalType) => {
  if (!storeInstances.has(portal)) {
    storeInstances.set(portal, createCalendarStore(portal));
  }
  return storeInstances.get(portal)!;
};

// Hook to use calendar store with portal parameter
export const useCalendarStore = (portal: PortalType) => {
  const useStore = getCalendarStore(portal);
  const state = useStore();
  
  // Auto-load sedationists when store is accessed
  const { data: sedationists, isLoading: isLoadingSedationists } = useQuery({
    queryKey: ["sedationists", portal],
    queryFn: async (): Promise<SedationistDto[]> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockSedationists;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });

  // Update store when sedationists data changes
  if (sedationists && sedationists !== state.sedationists) {
    state.setSedationists(sedationists);
  }

  if (isLoadingSedationists !== state.isLoadingSedationists) {
    state.setLoadingSedationists(isLoadingSedationists);
  }

  return {
    ...state,
    sedationists: sedationists || [],
    isLoadingSedationists,
  };
};