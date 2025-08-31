import { useAuth } from "../services/auth/hooks";
import { PortalType } from "../services/auth/types";
import { usePortalInfoAndRoutes } from "./usePortalInfoAndRoutes";

export const useUserAvailablePortals = () => {
  const { currentPortal, availablePortals } = useAuth();
  const { PORTAL_INFO } = usePortalInfoAndRoutes();

  return Object.entries(PORTAL_INFO)
    .filter(([portal]) => availablePortals.includes(portal as PortalType))
    .map(([portal, portalInfo]) => ({
      id: portal as PortalType,
      isActive: portal === currentPortal,
      ...portalInfo,
    }));
};
