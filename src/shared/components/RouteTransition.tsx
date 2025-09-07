import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface RouteTransitionProps {
  children: React.ReactNode;
  isInitialLoad?: boolean;
  enableTransitions?: boolean;
}

export function RouteTransition({
  children,
  isInitialLoad = false,
  enableTransitions = true,
}: RouteTransitionProps) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("entering");

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage("exiting");
    }
  }, [location, displayLocation]);

  // Enhanced animation variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.99,
    },
    in: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
    out: {
      opacity: 0,
      y: -10,
      scale: 0.99,
    },
  };

  const pageTransition = {
    type: "tween" as const,
    ease: [0.4, 0, 0.2, 1] as const,
    duration: 0.3,
  };

  const fastTransition = {
    type: "tween" as const,
    ease: [0.4, 0, 0.2, 1] as const,
    duration: 0.15,
  };

  // For initial load with enhanced animation
  if (isInitialLoad) {
    return (
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        variants={pageVariants}
        transition={pageTransition}
        className="page-enter"
      >
        {children}
      </motion.div>
    );
  }

  // For regular route changes with smooth transitions
  if (enableTransitions) {
    return (
      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          if (transitionStage === "exiting") {
            setDisplayLocation(location);
            setTransitionStage("entering");
          }
        }}
      >
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="min-h-screen"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    );
  }

  // Fallback without animations
  return <div key={location.pathname}>{children}</div>;
}
