import { SearchParams } from "./common";
import {
  UserStatus,
  Department,
  PermissionLevel,
} from "../domains/user-access/enums";

export interface UserSearchParams extends SearchParams {
  status?: UserStatus[];
  roles?: string[];
  departments?: Department[];
  permissionLevels?: PermissionLevel[];
  lastLoginAfter?: string;
}
