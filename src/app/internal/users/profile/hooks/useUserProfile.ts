import { useState } from "react";
import type { UserProfileState, UserProfileActions } from "../types";
import { UserManagementTab } from "../types";
import type { ManageableUser } from "@/shared/types";

export const useUserProfile = (user: ManageableUser) => {
  const [activeTab, setActiveTab] = useState<UserManagementTab>(
    UserManagementTab.Profile
  );

  const state: UserProfileState = {
    user,
    activeTab,
  };

  const actions: UserProfileActions = {
    setActiveTab,
  };

  return { state, actions };
};
