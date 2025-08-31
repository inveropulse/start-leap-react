import { useEffect } from "react";
import { useAuthStore } from "./store";
import { AuthErrorCode, UserRole } from "./types";

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
    availablePortals: store.user
      ? Object.entries(store.user.portalAccess)
          .map(([key, value]) => (value === true ? key : null))
          .filter((key): key is string => key !== null)
      : [],

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
