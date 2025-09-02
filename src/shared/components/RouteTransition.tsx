import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

interface RouteTransitionProps {
  children: React.ReactNode;
  isInitialLoad?: boolean;
}

export function RouteTransition({
  children,
  isInitialLoad = false,
}: RouteTransitionProps) {
  const location = useLocation();

  // For initial load, use animation wrapper
  if (isInitialLoad) {
    return (
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    );
  }

  // For regular route changes, render without animations
  return <div key={location.pathname}>{children}</div>;
}
