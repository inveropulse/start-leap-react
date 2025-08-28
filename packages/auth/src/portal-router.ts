import type { PortalType, User } from "./types";

// Simple portal routing logic
export class PortalRouter {
  static getDefaultPortal(user: User): PortalType {
    return user.defaultPortal;
  }

  static getAvailablePortals(user: User): PortalType[] {
    const portals: PortalType[] = [];

    if (user.permissions.internal) portals.push("internal");
    if (user.permissions.patient) portals.push("patient");
    if (user.permissions.sedationist) portals.push("sedationist");
    if (user.permissions.clinic) portals.push("clinic");

    return portals;
  }

  static canAccessPortal(user: User, portal: PortalType): boolean {
    return user.permissions[portal] === true;
  }
}
