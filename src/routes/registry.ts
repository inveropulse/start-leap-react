import { PortalRegistry } from "./types";
import { AUTH_CONFIG } from "./auth_routes";
import { PortalType } from "@/shared/types";
import { CLINIC_PORTAL } from "./clinic_routes";
import { PATIENT_PORTAL } from "./patient_routes";
import { INTERNAL_PORTAL } from "./internal_routes";
import { SEDATIONIST_PORTAL } from "./sedationist_routes";

const PORTAL_REGISTRY: PortalRegistry = {
  public: AUTH_CONFIG,
  portals: [INTERNAL_PORTAL, CLINIC_PORTAL, PATIENT_PORTAL, SEDATIONIST_PORTAL],
} as const;

export const getEnabledPublicRoutes = () => {
  return PORTAL_REGISTRY.public.routes.filter((route) => route.meta.enabled);
};

export const getEnabledPortals = () => {
  return PORTAL_REGISTRY.portals
    .filter((portal) => portal.enabled)
    .map((portal) => ({
      ...portal,
      routes: portal.routes.filter((route) => route.meta.enabled),
      quickActions: portal.quickActions.filter((action) => action.enabled),
    }));
};

export const getPortalByType = (type: PortalType) => {
  return getEnabledPortals().find((portal) => portal.key === type);
};
