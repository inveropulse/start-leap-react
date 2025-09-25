import { useState } from "react";
import { UserManagementTab } from "./types";
import { Tabs } from "@/shared/components/ui/tabs";
import type { ManageableUser } from "@/shared/types";
import { Dialog, DialogContent } from "@/shared/components/ui/dialog";
import UserManagementTabsList from "./components/UserManagementTabsList";
import { UserManagementHeader } from "./components/UserManagementHeader";
import { UserManagementTabsView } from "./components/UserManagementTabsView";

export interface UserManagementModalProps {
  open: boolean;
  onClose: () => void;
  user: ManageableUser;
}

export default function UserManagementModal(props: UserManagementModalProps) {
  const [activeTab, setActiveTab] = useState(
    UserManagementTab.Profile.toString()
  );

  return (
    <Dialog open={props.open} onOpenChange={props.onClose}>
      <DialogContent className="sm:max-w-[700px] max-w-2xl max-h-[90vh] overflow-y-auto">
        <UserManagementHeader user={props.user} />
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <UserManagementTabsList />
          <UserManagementTabsView user={props.user} />
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// const getTabContent = (tab: UserManagementTab) => {
//   switch (tab) {
//     case UserManagementTab.Profile:
//       return (
//         <UserProfileTab
//           isEditing={isEditing}
//           form={form}
//           handleSubmit={handleSubmit}
//           handleCancel={handleCancel}
//           handleEdit={handleEdit}
//           updateUserMutation={updateUserMutation}
//           roleOptions={roleOptions}
//           departmentOptions={departmentOptions}
//           permissionLevelOptions={permissionLevelOptions}
//           statusOptions={statusOptions}
//           user={user}
//           formatDate={formatDate}
//         />
//       );

//     case UserManagementTab.Roles:
//       return (
//         <div className="text-center text-muted-foreground py-8">
//           <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
//           <p>Roles & Permissions management coming soon</p>
//         </div>
//       );

//     case UserManagementTab.Security:
//       return <UserProfileAccessTab user={user} />;
//     case UserManagementTab.Activity:
//       return (
//         <UserProfileActivityTab
//           activities={activitiesQuery.data?.data || []}
//         />
//       );
//     case UserManagementTab.Sessions:
//       return (
//         <UserProfileSessionsTab sessions={sessionsQuery.data?.data || []} />
//       );
//     default:
//       return null;
//   }
// };
