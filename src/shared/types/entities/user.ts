import { UserStatus, Department, PermissionLevel } from '../enums/user';
import { UserRole } from '../index';

// Unified User entity interface
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

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  description: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface UserSession {
  id: string;
  userId: string;
  device: string;
  location: string;
  lastActive: string;
  isActive: boolean;
}