import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

export function RouteTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.18 } }}
        exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
