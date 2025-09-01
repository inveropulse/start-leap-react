import { motion } from "framer-motion";

interface AppLoadingOverlayProps {
  isLoading: boolean;
}

export function AppLoadingOverlay({ isLoading }: AppLoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div 
            className="w-8 h-8 border-2 border-muted border-t-primary rounded-full animate-spin"
            role="status"
            aria-label="Loading application"
          />
        </div>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-muted-foreground font-medium"
        >
          Loading...
        </motion.p>
      </div>
    </motion.div>
  );
}