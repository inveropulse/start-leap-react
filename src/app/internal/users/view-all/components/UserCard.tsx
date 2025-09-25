import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Mail, Phone } from "lucide-react";
import { ManageableUser } from "@/shared/types/domains/user-access";
import UserAvatar from "../../shared/components/UserAvatar";
import UserStatusBadge from "../../shared/components/UserStatusBadge";
import UserRoleBadge from "../../shared/components/UserRoleBadge";
import UserActions, {
  type CustomUserAction,
} from "../../shared/components/UserActions";

interface UserCardProps {
  user: ManageableUser;
  onView?: (user: ManageableUser) => void;
  onEdit?: (user: ManageableUser) => void;
  onDelete?: (user: ManageableUser) => void;
  onDeactivate?: (user: ManageableUser) => void;
  variant?: "default" | "compact";
  showLastLogin?: boolean;
  customActions?: CustomUserAction[];
}

export function UserCard({
  user,
  onView,
  onEdit,
  onDelete,
  onDeactivate,
  variant = "default",
  showLastLogin = true,
  customActions = [],
}: UserCardProps) {
  const isCompact = variant === "compact";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className={isCompact ? "p-4" : "p-6"}>
        <div className="flex items-start justify-between">
          {/* User Info Section */}
          <div className="flex items-center space-x-4">
            <UserAvatar user={user} size={isCompact ? "md" : "lg"} />

            <div className="space-y-1">
              <h3
                className={`font-medium ${isCompact ? "text-base" : "text-lg"}`}
              >
                {user.firstName} {user.lastName}
              </h3>

              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{user.email}</span>
              </div>

              {user.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{user.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <UserActions
            user={user}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onDeactivate={onDeactivate}
            customActions={customActions}
          />
        </div>

        {/* Badges and Meta Info */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UserStatusBadge status={user.status} />
            <UserRoleBadge role={user.role} />
            {user.department && (
              <Badge variant="outline">{user.department}</Badge>
            )}
          </div>

          {showLastLogin && user.lastLoginDate && (
            <div className="text-sm text-gray-500">
              Last login: {new Date(user.lastLoginDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
