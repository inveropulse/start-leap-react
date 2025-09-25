import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import type { ManageableUser } from "@/shared/types";
import { useState } from "react";

export interface UserAvatarProps {
  user: ManageableUser;
  size?: "sm" | "md" | "lg";
  showInitials?: boolean;
  className?: string;
}

/**
 * Reusable user avatar component following Single Responsibility Principle
 * Handles avatar display logic with size variants and fallback to initials
 */
export default function UserAvatar({
  user,
  size = "md",
  showInitials = true,
  className = "",
}: UserAvatarProps) {
  const [imgError, setImgError] = useState(false);
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const getInitials = (user: ManageableUser): string => {
    if (user.fullName) {
      return user.fullName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }

    const firstInitial = user.firstName?.[0] || "";
    const lastInitial = user.lastName?.[0] || "";
    return (firstInitial + lastInitial).toUpperCase() || "?";
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      {user.avatar && !imgError && (
        <AvatarImage
          src={user.avatar}
          alt={user.fullName || `${user.firstName} ${user.lastName}`}
          onError={() => setImgError(true)}
        />
      )}
      {showInitials && (
        <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
          {getInitials(user)}
        </AvatarFallback>
      )}
    </Avatar>
  );
}
