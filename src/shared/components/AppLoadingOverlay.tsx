import { PortalType } from "../types";
import { motion } from "framer-motion";
import { useAuth } from "../services/auth/hooks";
import { usePortalTheme } from "../hooks/usePortalTheme"; // Adjust the path as needed

interface AppLoadingOverlayProps {
  isLoading: boolean;
  isPortalSwitch?: boolean;
}

export function AppLoadingOverlay({
  isLoading,
  isPortalSwitch = false,
}: AppLoadingOverlayProps) {
  const { currentPortal } = useAuth();
  const theme = usePortalTheme(currentPortal || PortalType.INTERNAL); // Pass currentPortal to usePortalTheme

  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`fixed inset-0 z-50 flex items-center justify-center ${theme.backgroundClass}`} // Use backgroundClass
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          {/* Outer pulse ring */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`absolute inset-0 w-12 h-12 rounded-full -translate-x-2 -translate-y-2 ${theme.primaryClass}`} // Use primaryClass
          />

          {/* Main spinner */}
          <div
            className={`w-8 h-8 border-2 rounded-full animate-spin ${theme.secondaryClass}`} // Use secondaryClass
            role="status"
            aria-label="Loading application"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-center"
        >
          <p className={`text-sm font-medium ${theme.accentClass}`}>
            {" "}
            {/* Use accentClass */}
            {isPortalSwitch
              ? "Switching portal..."
              : "Preparing your portal..."}
          </p>

          {/* Loading dots */}
          <div className="flex justify-center gap-1 mt-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
                className={`w-1.5 h-1.5 rounded-full ${theme.primaryClass}`} // Use primaryClass
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
