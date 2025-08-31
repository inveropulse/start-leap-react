import React, {
  createContext,
  useContext,
  PropsWithChildren,
  useReducer,
  useEffect,
} from "react";
import { Toaster } from "../components/ui/toaster";
import { useLogging } from "./LoggingProvider";
import type { ToastActionElement, ToastProps } from "../components/ui/toast";

// Toast configuration and styling constants
const TOAST_CONFIG = {
  LIMIT: 3,
  REMOVE_DELAY: 5000, // 5 seconds default
  POSITIONS: {
    TOP_RIGHT: "top-right",
    TOP_LEFT: "top-left",
    BOTTOM_RIGHT: "bottom-right",
    BOTTOM_LEFT: "bottom-left",
    TOP_CENTER: "top-center",
    BOTTOM_CENTER: "bottom-center",
  } as const,
  VARIANTS: {
    SUCCESS: "success",
    ERROR: "destructive",
    WARNING: "warning",
    INFO: "default",
  } as const,
  DURATIONS: {
    SHORT: 3000,
    MEDIUM: 5000,
    LONG: 8000,
    PERSISTENT: null, // Won't auto-dismiss
  } as const,
} as const;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  duration?: number | null;
};

interface NotificationContextType {
  showSuccess: (
    message: string,
    description?: string,
    duration?: number
  ) => string;
  showError: (
    message: string,
    description?: string,
    duration?: number
  ) => string;
  showWarning: (
    message: string,
    description?: string,
    duration?: number
  ) => string;
  showInfo: (
    message: string,
    description?: string,
    duration?: number
  ) => string;
  showPersistent: (
    message: string,
    description?: string,
    variant?: keyof typeof TOAST_CONFIG.VARIANTS
  ) => string;
  dismiss: (toastId?: string) => void;
  dismissAll: () => void;
  updateToast: (toastId: string, props: Partial<ToasterToast>) => void;
  toasts: ToasterToast[];
}

const NotificationContext = createContext<NotificationContextType>(undefined!);

// Toast reducer logic (moved from use-toast.ts)
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

type ActionType = typeof actionTypes;
type Action =
  | { type: ActionType["ADD_TOAST"]; toast: ToasterToast }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
      toastId: string;
    }
  | { type: ActionType["DISMISS_TOAST"]; toastId?: string }
  | { type: ActionType["REMOVE_TOAST"]; toastId?: string };

interface State {
  toasts: ToasterToast[];
}

const toastReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_CONFIG.LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toastId ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined ? { ...t, open: false } : t
        ),
      };
    }

    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return { ...state, toasts: [] };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

let toastCount = 0;
const generateId = () => (++toastCount).toString();

export default function NotificationProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(toastReducer, { toasts: [] });
  const logger = useLogging({ feature: "notifications" });
  const timeoutsRef = React.useRef(new Map<string, number>());

  // Auto-dismiss logic
  useEffect(() => {
    state.toasts.forEach((toast) => {
      if (toast.duration !== null && !timeoutsRef.current.has(toast.id)) {
        const timeout = setTimeout(() => {
          dispatch({ type: "DISMISS_TOAST", toastId: toast.id });
          timeoutsRef.current.delete(toast.id);

          // Remove after animation
          setTimeout(() => {
            dispatch({ type: "REMOVE_TOAST", toastId: toast.id });
          }, 200);
        }, toast.duration || TOAST_CONFIG.DURATIONS.MEDIUM);

        timeoutsRef.current.set(toast.id, timeout);
      }
    });

    // Cleanup removed toasts' timeouts
    const currentToastIds = new Set(state.toasts.map((t) => t.id));
    for (const [id, timeout] of timeoutsRef.current.entries()) {
      if (!currentToastIds.has(id)) {
        clearTimeout(timeout);
        timeoutsRef.current.delete(id);
      }
    }
  }, [state.toasts]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      timeoutsRef.current.clear();
    };
  }, []);

  const createToast = (
    message: string,
    description?: string,
    variant: "default" | "destructive" | "success" | "warning" = "default",
    duration: number | null = TOAST_CONFIG.DURATIONS.MEDIUM
  ): string => {
    const id = generateId();

    const toast: ToasterToast = {
      id,
      title: message,
      description,
      variant,
      duration,
      open: true,
      onOpenChange: (open) => {
        if (!open) {
          dispatch({ type: "DISMISS_TOAST", toastId: id });
          setTimeout(() => {
            dispatch({ type: "REMOVE_TOAST", toastId: id });
          }, 200);
        }
      },
    };

    dispatch({ type: "ADD_TOAST", toast });
    return id;
  };

  const showSuccess = (
    message: string,
    description?: string,
    duration = TOAST_CONFIG.DURATIONS.MEDIUM
  ) => {
    logger.info("Success notification shown", { message, description });
    return createToast(
      message,
      description,
      TOAST_CONFIG.VARIANTS.SUCCESS,
      duration
    );
  };

  const showError = (
    message: string,
    description?: string,
    duration = TOAST_CONFIG.DURATIONS.LONG
  ) => {
    logger.warn("Error notification shown", { message, description });
    return createToast(
      message,
      description,
      TOAST_CONFIG.VARIANTS.ERROR,
      duration
    );
  };

  const showWarning = (
    message: string,
    description?: string,
    duration = TOAST_CONFIG.DURATIONS.MEDIUM
  ) => {
    logger.info("Warning notification shown", { message, description });
    return createToast(
      message,
      description,
      TOAST_CONFIG.VARIANTS.WARNING,
      duration
    );
  };

  const showInfo = (
    message: string,
    description?: string,
    duration = TOAST_CONFIG.DURATIONS.SHORT
  ) => {
    logger.info("Info notification shown", { message, description });
    return createToast(
      message,
      description,
      TOAST_CONFIG.VARIANTS.INFO,
      duration
    );
  };

  const showPersistent = (
    message: string,
    description?: string,
    variant: keyof typeof TOAST_CONFIG.VARIANTS = "INFO"
  ) => {
    logger.info("Persistent notification shown", {
      message,
      description,
      variant,
    });
    return createToast(
      message,
      description,
      TOAST_CONFIG.VARIANTS[variant],
      null
    );
  };

  const dismiss = (toastId?: string) => {
    dispatch({ type: "DISMISS_TOAST", toastId });

    if (toastId && timeoutsRef.current.has(toastId)) {
      clearTimeout(timeoutsRef.current.get(toastId)!);
      timeoutsRef.current.delete(toastId);
    }

    setTimeout(() => {
      dispatch({ type: "REMOVE_TOAST", toastId });
    }, 200);
  };

  const dismissAll = () => {
    // Clear all timeouts
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    timeoutsRef.current.clear();

    dispatch({ type: "DISMISS_TOAST" });
    setTimeout(() => {
      dispatch({ type: "REMOVE_TOAST" });
    }, 200);
  };

  const updateToast = (toastId: string, props: Partial<ToasterToast>) => {
    dispatch({ type: "UPDATE_TOAST", toast: props, toastId });
  };

  const contextValue: NotificationContextType = {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showPersistent,
    dismiss,
    dismissAll,
    updateToast,
    toasts: state.toasts,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <Toaster />
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (context == null) {
    throw new Error(
      `Invocations to ${useNotifications.name} should be within a node that is a child of ${NotificationProvider.name}`
    );
  }

  return context;
}
