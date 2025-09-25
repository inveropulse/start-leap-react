// UserProfile types for use-case specific logic
import type { ManageableUser } from "@/shared/types";
import {
  Activity,
  FileText,
  Lock,
  LucideProps,
  Shield,
  User,
} from "lucide-react";
import UserProfileTab from "../components/tabs-view/UserProfileTab";
import UserProfileSessionsTab from "../components/tabs-view/UserProfileSessionsTab";
import UserProfileActivityTab from "../components/tabs-view/UserProfileActivityTab";
import UserProfileAccessTab from "../components/tabs-view/UserProfileAccessTab";

export enum UserManagementTab {
  Profile = "Profile",
  Roles = "Roles",
  Security = "Security",
  Activity = "Activity",
  Sessions = "Sessions",
}

export const USER_MANAGEMENT_TABS: {
  label: UserManagementTab;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  content: React.ComponentType<{ user: ManageableUser }>;
}[] = [
  { label: UserManagementTab.Profile, icon: User, content: UserProfileTab },
  {
    label: UserManagementTab.Roles,
    icon: Shield,
    content: UserProfileAccessTab,
  },
  {
    label: UserManagementTab.Security,
    icon: Lock,
    content: UserProfileAccessTab,
  },
  {
    label: UserManagementTab.Activity,
    icon: Activity,
    content: UserProfileActivityTab,
  },
  {
    label: UserManagementTab.Sessions,
    icon: FileText,
    content: UserProfileSessionsTab,
  },
];

export interface UserProfileState {
  user: ManageableUser;
  activeTab: UserManagementTab;
}

export interface UserProfileActions {
  setActiveTab: (tab: UserManagementTab) => void;
}
