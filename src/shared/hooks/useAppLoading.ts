import { useState, useEffect } from "react";

export function useAppLoading() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return { isInitialLoading };
}