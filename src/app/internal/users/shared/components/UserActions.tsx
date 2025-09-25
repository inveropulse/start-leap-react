import { MoreHorizontal, Edit, Trash2, Eye, UserX } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import type { ManageableUser } from "@/shared/types";

export interface CustomUserAction {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (user: ManageableUser) => void;
  variant?: "default" | "destructive";
  separator?: boolean;
}

export interface UserActionsProps {
  user: ManageableUser;
  onView?: (user: ManageableUser) => void;
  onEdit?: (user: ManageableUser) => void;
  onDelete?: (user: ManageableUser) => void;
  onDeactivate?: (user: ManageableUser) => void;
  customActions?: CustomUserAction[];
  className?: string;
}

/**
 * Reusable user actions component with extension points
 * Follows Open/Closed Principle - extensible with custom actions
 */
export default function UserActions({
  user,
  onView,
  onEdit,
  onDelete,
  onDeactivate,
  customActions = [],
  className = "",
}: UserActionsProps) {
  const hasStandardActions = onView || onEdit || onDelete || onDeactivate;
  const hasCustomActions = customActions.length > 0;

  if (!hasStandardActions && !hasCustomActions) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${className}`}
          aria-label={`Actions for ${
            user.fullName || `${user.firstName} ${user.lastName}`
          }`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {onView && (
          <DropdownMenuItem onClick={() => onView(user)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem onClick={() => onEdit(user)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit User
          </DropdownMenuItem>
        )}
        {onDeactivate && (
          <DropdownMenuItem onClick={() => onDeactivate(user)}>
            <UserX className="mr-2 h-4 w-4" />
            Deactivate
          </DropdownMenuItem>
        )}

        {/* Custom actions */}
        {hasCustomActions && hasStandardActions && <DropdownMenuSeparator />}
        {customActions.map((action, index) => (
          <div key={index}>
            {action.separator && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onClick={() => action.onClick(user)}
              className={
                action.variant === "destructive"
                  ? "text-red-600 focus:text-red-600"
                  : ""
              }
            >
              {action.icon && <action.icon className="mr-2 h-4 w-4" />}
              {action.label}
            </DropdownMenuItem>
          </div>
        ))}

        {/* Destructive actions at bottom */}
        {onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(user)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete User
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
