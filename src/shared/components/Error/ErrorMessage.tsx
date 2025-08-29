// src/shared/components/Error/ErrorMessage.tsx
import React from "react";

interface ErrorMessageProps {
  title?: string;
  message?: string;
  severity?: "error" | "warning" | "info";
}

const severityStyles = {
  error: {
    title: "text-red-900",
    message: "text-red-700",
  },
  warning: {
    title: "text-yellow-900",
    message: "text-yellow-700",
  },
  info: {
    title: "text-blue-900",
    message: "text-blue-700",
  },
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = "Something went wrong",
  message = "We're sorry, but something unexpected happened. The error has been logged and our team has been notified.",
  severity = "error",
}) => {
  const styles = severityStyles[severity];

  return (
    <div>
      <h3 className={`text-lg font-medium ${styles.title} mb-2`}>{title}</h3>
      <div className={`text-sm ${styles.message} mb-4 leading-relaxed`}>
        {message}
      </div>
    </div>
  );
};
