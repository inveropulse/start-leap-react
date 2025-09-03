import { SimpleSecureStorage } from "./SimpleSecureStorage";
import { PortalType } from "@/shared/types";

export class CalendarStorageService {
  private storage: SimpleSecureStorage;

  constructor(storage: SimpleSecureStorage) {
    this.storage = storage;
  }

  private getPortalKey(portal: PortalType, key: string): string {
    return `calendar_${portal}_${key}`;
  }

  setSelectedSedationists(portal: PortalType, sedationistIds: string[]): void {
    const key = this.getPortalKey(portal, "selected_sedationists");
    this.storage.setItem(key, sedationistIds);
  }

  getSelectedSedationists(portal: PortalType): string[] {
    const key = this.getPortalKey(portal, "selected_sedationists");
    return this.storage.getItem(key) || [];
  }

  setViewMode(portal: PortalType, viewMode: "day" | "week"): void {
    const key = this.getPortalKey(portal, "view_mode");
    this.storage.setItem(key, viewMode);
  }

  getViewMode(portal: PortalType): "day" | "week" {
    const key = this.getPortalKey(portal, "view_mode");
    return this.storage.getItem(key) || "day";
  }

  setSelectedDate(portal: PortalType, date: Date): void {
    const key = this.getPortalKey(portal, "selected_date");
    this.storage.setItem(key, date.toISOString());
  }

  getSelectedDate(portal: PortalType): Date {
    const key = this.getPortalKey(portal, "selected_date");
    const stored = this.storage.getItem(key);
    return stored ? new Date(stored) : new Date();
  }

  clearPortalData(portal: PortalType): void {
    const keys = [
      "selected_sedationists",
      "view_mode", 
      "selected_date"
    ];
    
    keys.forEach(key => {
      const portalKey = this.getPortalKey(portal, key);
      this.storage.removeItem(portalKey);
    });
  }
}

export const calendarStorage = new CalendarStorageService(new SimpleSecureStorage());