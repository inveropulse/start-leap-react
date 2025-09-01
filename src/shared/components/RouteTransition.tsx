import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

interface RouteTransitionProps {
  children: React.ReactNode;
  isInitialLoad?: boolean;
}

export function RouteTransition({ children, isInitialLoad = false }: RouteTransitionProps) {
  const location = useLocation();
  
  // For regular route changes, render without animations
  if (!isInitialLoad) {
    return <div key={location.pathname}>{children}</div>;
  }
  
  // For initial load, use full animation
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ 
          opacity: 0, 
          y: 10, 
          scale: 0.4 
        }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: { 
            duration: 0.3,
            ease: "easeOut",
            staggerChildren: 0.1
          } 
        }}
        exit={{ 
          opacity: 0, 
          y: -10, 
          scale: 1.01,
          transition: { 
            duration: 0.2 
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
