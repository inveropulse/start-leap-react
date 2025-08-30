import { create } from "zustand";
import { secureStorage } from "./storage";
import { AuthState, PortalType, STORAGE_KEYS, AuthErrorCode } from "./types";

export interface AuthStore extends AuthState {
  // Core actions
  login: (state: AuthState) => void;
  logout: () => void;
  update: (changes: Partial<AuthState>) => void;
  clearError: () => void;

  // Portal management
  switchPortal: (portal: PortalType) => void;
  hasPortalAccess: (portal: PortalType) => boolean;

  // Token management
  isTokenExpired: () => boolean;
  shouldRefreshToken: () => boolean;

  // Storage management
  initialize: () => void;
  saveToStorage: () => void;
  clearStorage: () => void;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  errorCode: null,
  accessToken: null,
  refreshToken: null,
  tokenExpiry: null,
  currentPortal: null,
} as const;

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...initialState,

  // Initialize from storage
  initialize: () => {
    try {
      const stored = secureStorage.getItem(STORAGE_KEYS.AUTH_STATE);
      if (stored && stored.accessToken && stored.user) {
        // Verify token isn't expired
        const now = Date.now();
        if (stored.tokenExpiry && stored.tokenExpiry > now) {
          get().update({
            user: stored.user,
            isAuthenticated: true,
            accessToken: stored.accessToken,
            refreshToken: stored.refreshToken,
            tokenExpiry: stored.tokenExpiry,
            currentPortal: stored.currentPortal,
          });
        } else {
          // Token expired, clear storage
          get().clearStorage();
        }
      }
    } catch (error) {
      console.error("Failed to initialize auth from storage:", error);
      get().clearStorage();
    }
  },

  // Login action
  login: (state: AuthState) => {
    try {
      get().update({
        ...state,
      });
    } catch (error: any) {
      get().update({
        isLoading: false,
        error: error.message || "Login failed",
        errorCode: AuthErrorCode.INVALID_CREDENTIALS,
      });
      throw error;
    }
  },

  // Logout action
  logout: () => {
    get().update(initialState);
    get().clearStorage();
  },

  // Unified update method
  update: (changes: Partial<AuthState>) => {
    set(changes);
    get().saveToStorage();
  },

  // Clear error
  clearError: () => {
    get().update({ error: null, errorCode: null });
  },

  // Switch portal
  switchPortal: (portal: PortalType) => {
    const state = get();
    if (state.hasPortalAccess(portal)) {
      get().update({ currentPortal: portal });
    }
  },

  // Check portal access
  hasPortalAccess: (portal: PortalType) => {
    const { user } = get();
    return user?.portalAccess[portal] ?? false;
  },

  // Check if token is expired
  isTokenExpired: () => {
    const { tokenExpiry } = get();
    return !tokenExpiry || Date.now() >= tokenExpiry;
  },

  // Check if should refresh token (5 minutes before expiry)
  shouldRefreshToken: () => {
    const { tokenExpiry } = get();
    if (!tokenExpiry) return false;
    return Date.now() >= tokenExpiry - 5 * 60 * 1000;
  },

  // Save to storage
  saveToStorage: () => {
    const state = get();
    const dataToStore = {
      user: state.user,
      accessToken: state.accessToken,
      refreshToken: state.refreshToken,
      tokenExpiry: state.tokenExpiry,
      currentPortal: state.currentPortal,
    };

    try {
      secureStorage.setItem(STORAGE_KEYS.AUTH_STATE, dataToStore);
    } catch (error) {
      console.error("Failed to save auth state:", error);
    }
  },

  // Clear storage
  clearStorage: () => {
    try {
      secureStorage.removeItem(STORAGE_KEYS.AUTH_STATE);
    } catch (error) {
      console.error("Failed to clear auth storage:", error);
    }
  },
}));
