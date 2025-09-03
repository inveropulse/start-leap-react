import { create } from "zustand";
import { PortalType } from "@/shared/types";
import { calendarStorage } from "@/shared/services/storage/CalendarStorageService";

export interface CalendarState {
  // Portal context
  portal: PortalType;
  
  // View state
  viewMode: "day" | "week";
  selectedDate: Date;
  
  // Sedationist selection
  selectedSedationistIds: string[];
  
  // UI state
  isLoading: boolean;
  
  // Actions
  setPortal: (portal: PortalType) => void;
  setViewMode: (mode: "day" | "week") => void;
  setSelectedDate: (date: Date) => void;
  setSelectedSedationists: (ids: string[]) => void;
  addSedationist: (id: string) => void;
  removeSedationist: (id: string) => void;
  clearSedationists: () => void;
  setLoading: (loading: boolean) => void;
  
  // Persistence
  loadPersistedState: (portal: PortalType) => void;
  clearPortalData: () => void;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  // Initial state
  portal: PortalType.INTERNAL,
  viewMode: "day",
  selectedDate: new Date(),
  selectedSedationistIds: [],
  isLoading: false,

  // Actions
  setPortal: (portal: PortalType) => {
    set({ portal });
    get().loadPersistedState(portal);
  },

  setViewMode: (mode: "day" | "week") => {
    const { portal } = get();
    calendarStorage.setViewMode(portal, mode);
    set({ viewMode: mode });
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

  // Persistence
  loadPersistedState: (portal: PortalType) => {
    const viewMode = calendarStorage.getViewMode(portal);
    const selectedDate = calendarStorage.getSelectedDate(portal);
    const selectedSedationistIds = calendarStorage.getSelectedSedationists(portal);

    set({
      viewMode,
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