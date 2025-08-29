// src/shared/components/Error/ErrorMessage.tsx
import React from "react";

interface ErrorMessageProps {
  title?: string;
  message?: string;
  severity?: "error" | "warning" | "info";
}

const severityStyles = {
  error: {
    title: "text-destructive",
    message: "text-destructive/80",
  },
  warning: {
    title: "text-enterprise-secondary", 
    message: "text-enterprise-secondary/80",
  },
  info: {
    title: "text-enterprise-accent",
    message: "text-enterprise-accent/80",
  },
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = "Something went wrong",
  message = "We're sorry, but something unexpected happened. The error has been logged and our team has been notified.",
  severity = "error",
}) => {
  const styles = severityStyles[severity];

  return (
    <div className="space-y-3">
      <h3 className={`text-xl font-semibold ${styles.title} leading-tight`}>
        {title}
      </h3>
      <p className={`text-sm ${styles.message} leading-relaxed max-w-sm mx-auto`}>
        {message}
      </p>
    </div>
  );
};
