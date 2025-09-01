import { useState, useEffect } from "react";

export function useAppLoading() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show loading overlay for 600ms
    const loadingTimer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1500);

    // Show content after overlay fade-out + gap
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 900); // 600ms loading + 200ms fade-out + 100ms gap

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  // Check if this is a portal switch
  const isPortalSwitch = sessionStorage.getItem("portalSwitch") === "true";

  useEffect(() => {
    if (!isInitialLoading && isPortalSwitch) {
      // Clear the portal switch flag
      sessionStorage.removeItem("portalSwitch");
    }
  }, [isInitialLoading, isPortalSwitch]);

  return {
    isInitialLoading,
    showContent,
    isPortalSwitch,
  };
}
