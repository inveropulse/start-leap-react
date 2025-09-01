import { useEffect } from "react";
import { AuthErrorCode } from "./types";
import { AuthStore, useAuthStore } from "./store";
import { UserRole, PortalType } from "@/shared/types";
import { getEnabledPortals } from "@/routes/registry";

export const useAuth = () => {
  const store = useAuthStore();

  // Initialize on first use
  useEffect(() => {
    if (!store.isAuthenticated && !store.accessToken) {
      store.initialize();
    }
  }, [store.initialize, store.isAuthenticated, store.accessToken]);

  return {
    // State
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    errorCode: store.errorCode,
    currentPortal: store.currentPortal,
    availablePortals: getUserAvailablePortals(
      store.currentPortal,
      getUserAvailablePortalKeys(store)
    ),

    // Actions
    login: store.login,
    logout: store.logout,
    switchPortal: store.switchPortal,
    clearError: store.clearError,

    // Utilities
    hasPortalAccess: store.hasPortalAccess,
    isError: (code: AuthErrorCode) => store.errorCode === code,
    hasRole: (role: UserRole) => store.user?.role === role,
  };
};

const getUserAvailablePortalKeys = (store: AuthStore): PortalType[] => {
  return store.user
    ? (Object.entries(store.user.portalAccess)
        .map(([key, value]) => (value === true ? key : null))
        .filter((key): key is string => key !== null) as PortalType[])
    : [];
};

const getUserAvailablePortals = (
  currentPortal: PortalType,
  availablePortals: PortalType[]
) => {
  return getEnabledPortals()
    .filter((portal) => availablePortals.includes(portal.key))
    .map((portal) => ({
      id: portal.key,
      isActive: portal.key === currentPortal,
      ...portal,
    }));
};
