import { ManageableUser } from "@/shared/types";
import { USER_MANAGEMENT_TABS } from "../types";
import { TabsContent } from "@/shared/components/ui/tabs";

export interface UserManagementTabsViewProps {
  user: ManageableUser;
}
export function UserManagementTabsView(props: UserManagementTabsViewProps) {
  return (
    <>
      {USER_MANAGEMENT_TABS.map((tab) => (
        <TabsContent
          key={tab.label}
          value={tab.label.toString()}
          className="mt-6"
        >
          {<tab.content user={props.user} />}
        </TabsContent>
      ))}
    </>
  );
}
