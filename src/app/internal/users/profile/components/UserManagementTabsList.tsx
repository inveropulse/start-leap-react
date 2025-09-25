import { USER_MANAGEMENT_TABS, UserManagementTab } from "../types";
import { TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

export interface UserProfileTabsProps {
  activeTab: UserManagementTab;
  onTabChange: (tab: UserManagementTab) => void;
}

export default function UserManagementTabsList() {
  return (
    <TabsList className="grid w-full grid-cols-5">
      {USER_MANAGEMENT_TABS.map((tab) => (
        <TabsTrigger
          key={tab.label}
          value={tab.label}
          className="flex items-center gap-2"
        >
          {<tab.icon className="h-4 w-4" />}
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
