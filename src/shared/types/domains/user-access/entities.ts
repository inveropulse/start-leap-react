import { UserStatus, Department, PermissionLevel } from './enums';
import { UserRole } from './enums';

// Core user entity
export interface InternalUser {
  id: string;  
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: UserStatus;
  role: string | UserRole;
  department: Department;
  permissionLevel: PermissionLevel;
  joinDate: string;
  lastLogin?: string;
  lastPasswordChange?: string;
  profileImageUrl?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  department: Department;
  permissionLevel: PermissionLevel;
  notes?: string;
  sendWelcomeEmail?: boolean;
}

export interface UpdateUserData {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  department?: Department;
  permissionLevel?: PermissionLevel;
  status?: UserStatus;
  notes?: string;
}