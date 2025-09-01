import { motion } from "framer-motion";

interface AppLoadingOverlayProps {
  isLoading: boolean;
  isPortalSwitch?: boolean;
}

export function AppLoadingOverlay({ isLoading, isPortalSwitch = false }: AppLoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          {/* Outer pulse ring */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 w-12 h-12 border border-primary/20 rounded-full -translate-x-2 -translate-y-2"
          />
          
          {/* Main spinner */}
          <div 
            className="w-8 h-8 border-2 border-muted border-t-primary rounded-full animate-spin"
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
          <p className="text-sm text-muted-foreground font-medium">
            {isPortalSwitch ? "Switching portal..." : "Preparing your portal..."}
          </p>
          
          {/* Loading dots */}
          <div className="flex justify-center gap-1 mt-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1, 0.8]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
                className="w-1.5 h-1.5 bg-primary/60 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}