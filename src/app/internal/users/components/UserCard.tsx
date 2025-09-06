import { useState } from "react";
import { Mail, Phone, MoreVertical, Edit, Trash2, Shield, Clock, Eye } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { InternalUser, UserStatus, Department, PermissionLevel } from "../types";
import { UserRole } from "@/shared/types";
import { UserManagementModal } from "./UserManagementModal";
import { useUpdateUserStatusRequest, useDeleteUserRequest } from "../hooks/useUserMutations";

interface UserCardProps {
  user: InternalUser;
}

const getStatusColor = (status: UserStatus) => {
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

const getRoleColor = (role: string) => {
  switch (role) {
    case UserRole.ADMIN:
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case UserRole.BOOKING_COORDINATOR:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

const getPermissionLevelColor = (level: PermissionLevel) => {
  switch (level) {
    case PermissionLevel.FULL_ACCESS:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case PermissionLevel.LIMITED_ACCESS:
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    case PermissionLevel.READ_ONLY:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case PermissionLevel.CUSTOM:
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

const formatLastLogin = (lastLogin?: string) => {
  if (!lastLogin) return "Never";
  
  const loginDate = new Date(lastLogin);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - loginDate.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInHours < 168) {
    return `${Math.floor(diffInHours / 24)}d ago`;
  } else {
    return loginDate.toLocaleDateString();
  }
};

export function UserCard({ user }: UserCardProps) {
  const [showManagementModal, setShowManagementModal] = useState(false);
  const updateStatusMutation = useUpdateUserStatusRequest();
  const deleteUserMutation = useDeleteUserRequest();

  const handleStatusToggle = async () => {
    const newStatus = user.status === UserStatus.ACTIVE 
      ? UserStatus.INACTIVE 
      : UserStatus.ACTIVE;
    
    await updateStatusMutation.mutateAsync({ 
      userId: user.id, 
      status: newStatus 
    });
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      await deleteUserMutation.mutateAsync(user.id);
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user.profileImageUrl} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback>
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowManagementModal(true)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowManagementModal(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit User
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleStatusToggle}>
                  <Shield className="mr-2 h-4 w-4" />
                  {user.status === UserStatus.ACTIVE ? "Deactivate" : "Activate"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Status and Role Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge className={getStatusColor(user.status)} variant="secondary">
              {user.status.replace('_', ' ').toLowerCase()}
            </Badge>
            <Badge className={getRoleColor(user.role)} variant="secondary">
              {user.role.replace('_', ' ').toLowerCase()}
            </Badge>
            <Badge className={getPermissionLevelColor(user.permissionLevel)} variant="secondary">
              {user.permissionLevel.replace('_', ' ').toLowerCase()}
            </Badge>
          </div>

          {/* User Info */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span className="capitalize">{user.department.replace('_', ' ')}</span>
            </div>
            
            {user.phone && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{user.phone}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Last login: {formatLastLogin(user.lastLogin)}</span>
            </div>
          </div>

          {/* Contact Actions */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => window.open(`mailto:${user.email}`)}
            >
              <Mail className="h-4 w-4 mr-1" />
              Email
            </Button>
            {user.phone && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => window.open(`tel:${user.phone}`)}
              >
                <Phone className="h-4 w-4 mr-1" />
                Call
              </Button>
            )}
          </div>

          {/* Notes */}
          {user.notes && (
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground line-clamp-2">
                {user.notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <UserManagementModal
        user={user}
        open={showManagementModal}
        onOpenChange={setShowManagementModal}
      />
    </>
  );
}