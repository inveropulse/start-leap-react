import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { sedationistUtils } from "../utils";

interface SedationistAvatarProps {
  firstName: string;
  lastName: string;
  profilePicture?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const SedationistAvatar = ({
  firstName,
  lastName,
  profilePicture,
  size = "md",
  className,
}: SedationistAvatarProps) => {
  const sizeClasses = {
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10",
    lg: "h-12 w-12 text-lg",
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className || ""}`}>
      {profilePicture && (
        <img
          src={profilePicture}
          alt={sedationistUtils.getFullName(firstName, lastName)}
          className="object-cover"
        />
      )}
      <AvatarFallback>
        {sedationistUtils.getInitials(firstName, lastName)}
      </AvatarFallback>
    </Avatar>
  );
};
