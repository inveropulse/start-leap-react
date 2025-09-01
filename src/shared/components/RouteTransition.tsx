import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

interface RouteTransitionProps {
  children: React.ReactNode;
  isInitialLoad?: boolean;
}

export function RouteTransition({
  children,
  isInitialLoad = false,
}: RouteTransitionProps) {
  const location = useLocation();

  // For regular route changes, render without animations
  if (!isInitialLoad) {
    return <div key={location.pathname}>{children}</div>;
  }

  // For initial load, use full animation
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname}>{children}</motion.div>
    </AnimatePresence>
  );
}
