import { UserRole } from "./enums";
import { UserStatus, Department, PermissionLevel, PortalType } from "./enums";

export type BaseUserFields = {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phone?: string;
  department?: Department;
  permissionLevel?: PermissionLevel;
  status: UserStatus;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type UserPortalAccess = {
  [PortalType.CLINIC]: boolean;
  [PortalType.INTERNAL]: boolean;
  [PortalType.PATIENT]: boolean;
  [PortalType.SEDATIONIST]: boolean;
};

export type AuthenticatedUser = Readonly<BaseUserFields> & {
  readonly id: string;
  readonly fullName: string;
  readonly avatar?: string;
  readonly lastLoginDate?: string;
  readonly lastPasswordChangeDate?: string;
  readonly portalAccess: Readonly<UserPortalAccess>;
};

export type ManageableUser = BaseUserFields & {
  id: string;
  fullName?: string; // Computed field
  avatar?: string;
  lastLoginDate?: string;
  lastPasswordChangeDate?: string;
  portalAccess?: UserPortalAccess;
};
