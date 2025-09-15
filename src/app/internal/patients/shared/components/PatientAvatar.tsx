import { memo } from "react";
import { User } from "lucide-react";
import { Patient } from "@/shared/types";

export interface PatientAvatarProps {
  patient: Patient;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const PatientAvatar = memo(function PatientAvatar({
  patient,
  size = "md",
  className = "",
}: PatientAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
    xl: "h-8 w-8",
  };

  // Generate initials
  const getInitials = () => {
    const firstName = patient.firstName?.trim();
    const lastName = patient.lastName?.trim();

    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName.substring(0, 2).toUpperCase();
    }
    if (lastName) {
      return lastName.substring(0, 2).toUpperCase();
    }
    return "P";
  };

  // Generate a consistent color based on the name
  const getAvatarColor = () => {
    const name = `${patient.firstName || ""}${
      patient.lastName || ""
    }`.toLowerCase();
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-orange-500",
      "bg-red-500",
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  const initials = getInitials();
  const colorClass = getAvatarColor();

  return (
    <div
      className={`
        ${sizeClasses[size]} 
        ${colorClass} 
        rounded-full 
        flex 
        items-center 
        justify-center 
        text-white 
        font-medium 
        flex-shrink-0
        ${className}
      `}
    >
      {initials.length > 0 ? (
        <span>{initials}</span>
      ) : (
        <User className={iconSizes[size]} />
      )}
    </div>
  );
});
