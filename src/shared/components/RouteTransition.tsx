import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

interface RouteTransitionProps {
  children: React.ReactNode;
  isInitialLoad?: boolean;
}

export function RouteTransition({ children, isInitialLoad = false }: RouteTransitionProps) {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: isInitialLoad ? 20 : 6 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          transition: { 
            duration: isInitialLoad ? 0.5 : 0.18,
            ease: "easeOut"
          } 
        }}
        exit={{ 
          opacity: 0, 
          y: isInitialLoad ? -10 : -4, 
          transition: { 
            duration: isInitialLoad ? 0.3 : 0.12 
          } 
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
