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
        initial={{ 
          opacity: 0, 
          ...(isInitialLoad && { y: 20, scale: 0.98 })
        }}
        animate={{ 
          opacity: 1, 
          ...(isInitialLoad && { y: 0, scale: 1 }),
          transition: { 
            duration: isInitialLoad ? 0.6 : 0.1,
            ease: "easeOut",
            staggerChildren: isInitialLoad ? 0.1 : 0
          } 
        }}
        exit={{ 
          opacity: 0, 
          ...(isInitialLoad && { y: -10, scale: 1.02 }),
          transition: { 
            duration: isInitialLoad ? 0.3 : 0.08 
          } 
        }}
        style={{
          willChange: 'transform, opacity'
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
