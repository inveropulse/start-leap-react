import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Badge } from "@/shared/components/ui/badge";
import { User, Shield, Activity, Lock, FileText } from "lucide-react";
import { ManageableUser, UserStatus } from "@/shared/types/domains/user-access";
import { UserProfileTab } from "../../profile/components/tabs-view/UserProfileTab";

interface UserManagementModalProps {
  user: ManageableUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function UserManagementModal({
  user,
  open,
  onOpenChange,
}: UserManagementModalProps) {
  const [activeTab, setActiveTab] = useState("profile");

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div>
              <DialogTitle className="text-xl">
                {user.firstName} {user.lastName}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <span>{user.email}</span>
                <Badge
                  className={getStatusColor(user.status)}
                  variant="secondary"
                >
                  {user.status.replace("_", " ").toLowerCase()}
                </Badge>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Roles
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <UserProfileTab user={user} />
          </TabsContent>

          <TabsContent value="roles" className="mt-6">
            <div className="text-center text-muted-foreground py-8">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Roles & Permissions management coming soon</p>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <div className="text-center text-muted-foreground py-8">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Activity tracking coming soon</p>
            </div>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <div className="text-center text-muted-foreground py-8">
              <Lock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Security settings coming soon</p>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="mt-6">
            <div className="text-center text-muted-foreground py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Notes management coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
