import { Badge } from "@/shared/components/ui/badge";
import { UserRole } from "@/shared/types";

export interface UserRoleBadgeProps {
  role: UserRole;
  className?: string;
}

/**
 * Reusable role badge component for users
 * Follows Single Responsibility Principle - only handles role display
 */
export default function UserRoleBadge({
  role,
  className = "",
}: UserRoleBadgeProps) {
  const getRoleConfig = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return {
          variant: "default" as const,
          className: "bg-purple-100 text-purple-800 hover:bg-purple-200",
          label: "Admin",
        };
      case UserRole.CLINIC:
        return {
          variant: "secondary" as const,
          className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
          label: "Clinic",
        };
      case UserRole.PATIENT:
        return {
          variant: "outline" as const,
          className:
            "bg-green-100 text-green-800 hover:bg-green-200 border-green-300",
          label: "Patient",
        };
      case UserRole.SEDATIONIST:
        return {
          variant: "outline" as const,
          className:
            "bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-indigo-300",
          label: "Sedationist",
        };
      case UserRole.BOOKING_COORDINATOR:
        return {
          variant: "outline" as const,
          className:
            "bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-300",
          label: "Booking Coordinator",
        };
      default:
        return {
          variant: "outline" as const,
          className: "bg-gray-100 text-gray-600",
          label: role,
        };
    }
  };

  const config = getRoleConfig(role);

  return (
    <Badge
      variant={config.variant}
      className={`${config.className} ${className}`}
    >
      {config.label}
    </Badge>
  );
}
