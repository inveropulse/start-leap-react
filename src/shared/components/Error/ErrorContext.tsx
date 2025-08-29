// src/shared/components/Error/ErrorContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { ErrorContextType } from "./types";

const ErrorContext = createContext<ErrorContextType | null>(null);

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [errorCount, setErrorCount] = useState(0);

  const reportError = (error: Error, context?: Record<string, any>) => {
    setErrorCount((prev) => prev + 1);
    console.error("Manual error report", error, context);
  };

  const clearError = () => {
    setErrorCount(0);
  };

  const value: ErrorContextType = {
    reportError,
    clearError,
    errorCount,
  };

  return (
    <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>
  );
};

export const useErrorContext = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useErrorContext must be used within an ErrorProvider");
  }
  return context;
};

