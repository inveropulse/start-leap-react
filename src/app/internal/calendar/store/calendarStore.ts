import { create } from "zustand";
import { useEffect } from "react";
import { PortalType } from "@/shared/types";
import { useSedationists } from "../hooks/useCalendarData";
import { SedationistDto } from "@/api/generated/models/SedationistDto";
import { calendarStorage } from "@/shared/services/storage/CalendarStorageService";

export enum CalendarViewMode {
  DAY = "day",
  WEEK = "week",
}

export type CalendarState = {
  // Portal context
  portal: PortalType;

  // View state
  viewMode: CalendarViewMode;
  selectedDate: Date;

  // Sedationist data
  sedationists: SedationistDto[];
  selectedSedationistIds: string[];

  // Modal state
  selectedAppointmentId: string | null;
  isAppointmentModalOpen: boolean;
  selectedAvailabilityId: string | null;
  isAvailabilityModalOpen: boolean;

  // UI state
  isLoading: boolean;
  isLoadingSedationists: boolean;

  // Actions
  setPortal: (portal: PortalType) => void;
  setViewMode: (mode: CalendarViewMode) => void;
  setSelectedDate: (date: Date) => void;
  setSelectedSedationists: (ids: string[]) => void;
  addSedationist: (id: string) => void;
  removeSedationist: (id: string) => void;
  clearSedationists: () => void;
  setLoading: (loading: boolean) => void;
  setSedationists: (sedationists: SedationistDto[]) => void;
  setLoadingSedationists: (loading: boolean) => void;
  refreshSedationists: () => Promise<void>;

  // Modal actions
  openAppointmentModal: (appointmentId: string) => void;
  closeAppointmentModal: () => void;
  openAvailabilityModal: (availabilityId: string) => void;
  closeAvailabilityModal: () => void;

  // Persistence
  loadPersistedState: (portal: PortalType) => void;
  clearPortalData: () => void;
};

export type CalendarStore = ReturnType<typeof createCalendarStore>;

const storeInstances = new Map<PortalType, CalendarStore>();

const createCalendarStore = (portal: PortalType) => {
  return create<CalendarState>((set, get) => ({
    // Initial state
    portal,
    viewMode: CalendarViewMode.DAY,
    selectedDate: new Date(),
    sedationists: [],
    selectedSedationistIds: [],
    selectedAppointmentId: null,
    isAppointmentModalOpen: false,
    selectedAvailabilityId: null,
    isAvailabilityModalOpen: false,
    isLoading: false,
    isLoadingSedationists: false,

    // Actions
    setPortal: (newPortal: PortalType) => {
      set({ portal: newPortal });
      get().loadPersistedState(newPortal);
    },

    setViewMode: (mode: CalendarViewMode) => {
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
      const newIds = selectedSedationistIds.filter((sid) => sid !== id);
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

    refreshSedationists: async () => {
      // This will be overridden by the hook
      return Promise.resolve();
    },

    // Modal actions
    openAppointmentModal: (appointmentId: string) => {
      set({
        selectedAppointmentId: appointmentId,
        isAppointmentModalOpen: true,
      });
    },

    closeAppointmentModal: () => {
      set({ selectedAppointmentId: null, isAppointmentModalOpen: false });
    },

    openAvailabilityModal: (availabilityId: string) => {
      set({
        selectedAvailabilityId: availabilityId,
        isAvailabilityModalOpen: true,
      });
    },

    closeAvailabilityModal: () => {
      set({ selectedAvailabilityId: null, isAvailabilityModalOpen: false });
    },

    // Persistence
    loadPersistedState: (targetPortal: PortalType) => {
      const selectedDate = calendarStorage.getSelectedDate(targetPortal);
      const selectedSedationistIds =
        calendarStorage.getSelectedSedationists(targetPortal);
      const viewMode = calendarStorage.getViewMode(targetPortal);

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
        viewMode: CalendarViewMode.DAY,
        selectedDate: new Date(),
        selectedSedationistIds: [],
        selectedAppointmentId: null,
        isAppointmentModalOpen: false,
        selectedAvailabilityId: null,
        isAvailabilityModalOpen: false,
      });
    },
  }));
};

// Get or create store instance for specific portal
const getCalendarStore = (portal: PortalType): CalendarStore => {
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
  const {
    data: sedationists,
    isLoading: isLoadingSedationists,
    refetch,
  } = useSedationists();

  // Use useEffect to update store when sedationists data changes
  useEffect(() => {
    if (sedationists && sedationists !== state.sedationists) {
      state.setSedationists(sedationists);
    }
  }, [sedationists, state.sedationists, state.setSedationists]);

  useEffect(() => {
    if (isLoadingSedationists !== state.isLoadingSedationists) {
      state.setLoadingSedationists(isLoadingSedationists);
    }
  }, [
    isLoadingSedationists,
    state.isLoadingSedationists,
    state.setLoadingSedationists,
  ]);

  return {
    ...state,
    sedationists: sedationists || [],
    isLoadingSedationists,
    refreshSedationists: async () => {
      await refetch();
    },
  };
};
