// src/shared/components/Error/ErrorIcon.tsx
import React from "react";

interface ErrorIconProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export const ErrorIcon: React.FC<ErrorIconProps> = ({
  className = "text-red-400",
  size = "md",
}) => {
  return (
    <svg
      className={`${sizeClasses[size]} ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      role="img"
      aria-label="Error icon"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
};
