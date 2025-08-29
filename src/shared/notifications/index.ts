// Single entry point for all notification functionality
export {
  default as NotificationProvider,
  useNotifications,
  TOAST_CONFIG,
} from "../provider/NotificationProvider";
export type { ToastProps, ToastActionElement } from "../ui/toast";
