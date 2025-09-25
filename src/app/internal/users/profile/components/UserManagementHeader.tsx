import {
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui";
import { ManageableUser, UserStatus } from "@/shared/types";

export interface UserManagemenHeaderProps {
  user: ManageableUser;
}
export function UserManagementHeader({ user }: UserManagemenHeaderProps) {
  return (
    <DialogHeader>
      <div className="flex items-center gap-3">
        <div>
          <DialogTitle className="text-xl">
            {user.firstName} {user.lastName}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 mt-1">
            <span>{user.email}</span>
            <Badge
              className={getUserStatusColor(user.status)}
              variant="secondary"
            >
              {user.status.replace("_", " ").toLowerCase()}
            </Badge>
          </DialogDescription>
        </div>
      </div>
    </DialogHeader>
  );
}

const getUserStatusColor = (status: UserStatus) => {
  switch (status) {
    case UserStatus.ACTIVE:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case UserStatus.INACTIVE:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    case UserStatus.SUSPENDED:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case UserStatus.PENDING_ACTIVATION:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};
