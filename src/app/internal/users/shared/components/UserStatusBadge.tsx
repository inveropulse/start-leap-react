import { Badge } from "@/shared/components/ui/badge";
import { UserStatus } from "@/shared/types";

export interface UserStatusBadgeProps {
  status: UserStatus;
  className?: string;
}

/**
 * Reusable status badge component for users
 * Follows Single Responsibility Principle - only handles status display
 */
export default function UserStatusBadge({
  status,
  className = "",
}: UserStatusBadgeProps) {
  const getStatusConfig = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return {
          variant: "default" as const,
          className: "bg-green-100 text-green-800 hover:bg-green-200",
          label: "Active",
        };
      case UserStatus.INACTIVE:
        return {
          variant: "secondary" as const,
          className: "bg-gray-100 text-gray-800 hover:bg-gray-200",
          label: "Inactive",
        };
      case UserStatus.PENDING_ACTIVATION:
        return {
          variant: "outline" as const,
          className:
            "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300",
          label: "Pending Activation",
        };
      case UserStatus.SUSPENDED:
        return {
          variant: "destructive" as const,
          className: "bg-red-100 text-red-800 hover:bg-red-200",
          label: "Suspended",
        };
      default:
        return {
          variant: "outline" as const,
          className: "bg-gray-100 text-gray-600",
          label: status,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge
      variant={config.variant}
      className={`${config.className} ${className}`}
    >
      {config.label}
    </Badge>
  );
}
