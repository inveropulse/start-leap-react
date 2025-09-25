import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Checkbox } from "@/shared/components/ui/checkbox";
import UserAvatar from "./UserAvatar";
import UserStatusBadge from "./UserStatusBadge";
import UserRoleBadge from "./UserRoleBadge";
import UserActions, { type CustomUserAction } from "./UserActions";
import type { ManageableUser } from "@/shared/types";

export interface UserTableColumn {
  key: string;
  title: string;
  render?: (user: ManageableUser) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface UserDataTableProps {
  users: ManageableUser[];
  selectedUserIds: string[];
  onSelectionChange: (userIds: string[]) => void;
  onUserSelect: (userId: string, selected: boolean) => void;
  onUserAction?: (action: string, user: ManageableUser) => void;
  customActions?: CustomUserAction[];
  customColumns?: UserTableColumn[];
  showSelection?: boolean;
  showActions?: boolean;
  className?: string;
}

/**
 * Extensible data table component for users
 * Follows Open/Closed Principle with customizable columns and actions
 */
export default function UserListView({
  users,
  selectedUserIds,
  onSelectionChange,
  onUserSelect,
  onUserAction,
  customActions = [],
  customColumns = [],
  showSelection = true,
  showActions = true,
  className = "",
}: UserDataTableProps) {
  // Default columns
  const defaultColumns: UserTableColumn[] = [
    {
      key: "user",
      title: "User",
      render: (user) => (
        <div className="flex items-center gap-3">
          <UserAvatar user={user} size="sm" />
          <div className="min-w-0">
            <div className="font-medium text-gray-900">
              {user.fullName || `${user.firstName} ${user.lastName}`}
            </div>
            <div className="text-sm text-gray-500 truncate">{user.email}</div>
          </div>
        </div>
      ),
      width: "300px",
    },
    {
      key: "role",
      title: "Role",
      render: (user) => <UserRoleBadge role={user.role} />,
    },
    {
      key: "status",
      title: "Status",
      render: (user) => <UserStatusBadge status={user.status} />,
    },
    {
      key: "department",
      title: "Department",
      render: (user) => (
        <span className="text-sm text-gray-600">
          {user.department || "Unassigned"}
        </span>
      ),
    },
    {
      key: "lastLogin",
      title: "Last Login",
      render: (user) => (
        <span className="text-sm text-gray-600">
          {user.lastLoginDate
            ? new Date(user.lastLoginDate).toLocaleDateString()
            : "Never"}
        </span>
      ),
    },
  ];

  // Merge default and custom columns
  const allColumns = useMemo(() => {
    return [...defaultColumns, ...customColumns];
  }, [customColumns]);

  const allSelected =
    users.length > 0 && selectedUserIds.length === users.length;
  const someSelected =
    selectedUserIds.length > 0 && selectedUserIds.length < users.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(users.map((user) => user.id!));
    } else {
      onSelectionChange([]);
    }
  };

  const handleUserAction = (action: string, user: ManageableUser) => {
    if (onUserAction) {
      onUserAction(action, user);
    }
  };

  if (users.length === 0) {
    return <div className="text-center py-8 text-gray-500">No users found</div>;
  }

  return (
    <div className={`border rounded-lg ${className}`}>
      <Table>
        <TableHeader>
          <TableRow>
            {showSelection && (
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected || someSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all users"
                  className={
                    someSelected ? "data-[state=checked]:bg-blue-600" : ""
                  }
                />
              </TableHead>
            )}
            {allColumns.map((column) => (
              <TableHead key={column.key} style={{ width: column.width }}>
                {column.title}
              </TableHead>
            ))}
            {showActions && (
              <TableHead className="w-12">
                <span className="sr-only">Actions</span>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const isSelected = selectedUserIds.includes(user.id!);
            return (
              <TableRow key={user.id}>
                {showSelection && (
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        onUserSelect(user.id!, checked as boolean)
                      }
                      aria-label={`Select ${
                        user.fullName || `${user.firstName} ${user.lastName}`
                      }`}
                    />
                  </TableCell>
                )}
                {allColumns.map((column) => (
                  <TableCell key={column.key}>
                    {column.render
                      ? column.render(user)
                      : (user as any)[column.key]}
                  </TableCell>
                ))}
                {showActions && (
                  <TableCell>
                    <UserActions
                      user={user}
                      onView={(user) => handleUserAction("view", user)}
                      onEdit={(user) => handleUserAction("edit", user)}
                      onDelete={(user) => handleUserAction("delete", user)}
                      onDeactivate={(user) =>
                        handleUserAction("deactivate", user)
                      }
                      customActions={customActions}
                    />
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
