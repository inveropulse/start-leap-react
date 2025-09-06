import { 
  InternalUser, 
  UserSearchParams, 
  UserPaginationResponse,
  CreateUserData,
  UpdateUserData,
  UserStatus,
  Department,
  PermissionLevel,
  UserActivity,
  UserSession
} from '../types';
import { UserRole } from '@/shared/types';

// Mock internal users data
const mockUsers: InternalUser[] = [
  {
    id: 'user-1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@company.com',
    phone: '+1-555-0101',
    status: UserStatus.ACTIVE,
    role: UserRole.ADMIN,
    department: Department.ADMINISTRATION,
    permissionLevel: PermissionLevel.FULL_ACCESS,
    joinDate: '2023-01-15',
    lastLogin: '2024-01-15T09:30:00Z',
    lastPasswordChange: '2023-11-20T14:22:00Z',
    profileImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    notes: 'Senior administrator with full system access',
    isActive: true,
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2024-01-15T09:30:00Z',
  },
  {
    id: 'user-2',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@company.com',
    phone: '+1-555-0102',
    status: UserStatus.ACTIVE,
    role: UserRole.BOOKING_COORDINATOR,
    department: Department.BOOKING,
    permissionLevel: PermissionLevel.LIMITED_ACCESS,
    joinDate: '2023-03-20',
    lastLogin: '2024-01-14T16:45:00Z',
    lastPasswordChange: '2023-12-01T11:15:00Z',
    profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    notes: 'Lead booking coordinator for eastern region',
    isActive: true,
    createdAt: '2023-03-20T14:30:00Z',
    updatedAt: '2024-01-14T16:45:00Z',
  },
  {
    id: 'user-3',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.rodriguez@company.com',
    phone: '+1-555-0103',
    status: UserStatus.ACTIVE,
    role: UserRole.BOOKING_COORDINATOR,
    department: Department.BOOKING,
    permissionLevel: PermissionLevel.LIMITED_ACCESS,
    joinDate: '2023-06-10',
    lastLogin: '2024-01-15T08:15:00Z',
    lastPasswordChange: '2023-10-15T13:45:00Z',
    profileImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    notes: 'Booking coordinator specializing in complex cases',
    isActive: true,
    createdAt: '2023-06-10T12:00:00Z',
    updatedAt: '2024-01-15T08:15:00Z',
  },
  {
    id: 'user-4',
    firstName: 'James',
    lastName: 'Wilson',
    email: 'james.wilson@company.com',
    phone: '+1-555-0104',
    status: UserStatus.INACTIVE,
    role: UserRole.ADMIN,
    department: Department.IT,
    permissionLevel: PermissionLevel.FULL_ACCESS,
    joinDate: '2022-11-05',
    lastLogin: '2023-12-22T17:30:00Z',
    lastPasswordChange: '2023-08-10T09:20:00Z',
    notes: 'IT Administrator - Currently on extended leave',
    isActive: false,
    createdAt: '2022-11-05T10:00:00Z',
    updatedAt: '2023-12-22T17:30:00Z',
  },
  {
    id: 'user-5',
    firstName: 'Lisa',
    lastName: 'Anderson',
    email: 'lisa.anderson@company.com',
    phone: '+1-555-0105',
    status: UserStatus.PENDING_ACTIVATION,
    role: UserRole.BOOKING_COORDINATOR,
    department: Department.BOOKING,
    permissionLevel: PermissionLevel.READ_ONLY,
    joinDate: '2024-01-12',
    notes: 'New hire - Awaiting security clearance',
    isActive: false,
    createdAt: '2024-01-12T14:00:00Z',
    updatedAt: '2024-01-12T14:00:00Z',
  },
  {
    id: 'user-6',
    firstName: 'David',
    lastName: 'Thompson',
    email: 'david.thompson@company.com',
    phone: '+1-555-0106',
    status: UserStatus.SUSPENDED,
    role: UserRole.BOOKING_COORDINATOR,
    department: Department.OPERATIONS,
    permissionLevel: PermissionLevel.LIMITED_ACCESS,
    joinDate: '2023-09-15',
    lastLogin: '2024-01-10T12:00:00Z',
    lastPasswordChange: '2023-12-05T10:30:00Z',
    notes: 'Account suspended pending investigation',
    isActive: false,
    createdAt: '2023-09-15T11:00:00Z',
    updatedAt: '2024-01-10T12:00:00Z',
  },
];

// Mock user activities
const mockUserActivities: UserActivity[] = [
  {
    id: 'activity-1',
    userId: 'user-1',
    action: 'LOGIN',
    description: 'User logged in successfully',
    timestamp: '2024-01-15T09:30:00Z',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: 'activity-2',
    userId: 'user-1',
    action: 'USER_CREATED',
    description: 'Created new user: Lisa Anderson',
    timestamp: '2024-01-12T14:00:00Z',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
];

// Mock user sessions
const mockUserSessions: UserSession[] = [
  {
    id: 'session-1',
    userId: 'user-1',
    device: 'Chrome on Windows',
    location: 'New York, NY',
    lastActive: '2024-01-15T09:30:00Z',
    isActive: true
  },
  {
    id: 'session-2',
    userId: 'user-2',
    device: 'Safari on iPhone',
    location: 'Los Angeles, CA',
    lastActive: '2024-01-14T16:45:00Z',
    isActive: false
  }
];

export class MockUserService {
  static async getUsers(params: UserSearchParams = {}): Promise<UserPaginationResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let filteredUsers = [...mockUsers];

    // Apply search filter
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.role.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (params.status && params.status.length > 0) {
      filteredUsers = filteredUsers.filter(user =>
        params.status!.includes(user.status)
      );
    }

    // Apply role filter
    if (params.roles && params.roles.length > 0) {
      filteredUsers = filteredUsers.filter(user =>
        params.roles!.includes(user.role)
      );
    }

    // Apply department filter
    if (params.departments && params.departments.length > 0) {
      filteredUsers = filteredUsers.filter(user =>
        params.departments!.includes(user.department)
      );
    }

    // Apply permission level filter
    if (params.permissionLevels && params.permissionLevels.length > 0) {
      filteredUsers = filteredUsers.filter(user =>
        params.permissionLevels!.includes(user.permissionLevel)
      );
    }

    // Sort by creation date (newest first)
    filteredUsers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Apply pagination
    const pageNo = params.pageNo || 1;
    const pageSize = params.pageSize || 25;
    const totalCount = filteredUsers.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const startIndex = (pageNo - 1) * pageSize;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

    return {
      items: paginatedUsers,
      totalCount,
      pageNo,
      pageSize,
      totalPages,
    };
  }

  static async getUser(id: string): Promise<InternalUser | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockUsers.find(user => user.id === id) || null;
  }

  static async createUser(data: CreateUserData): Promise<InternalUser> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newUser: InternalUser = {
      id: `user-${Date.now()}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      status: UserStatus.PENDING_ACTIVATION,
      role: data.role,
      department: data.department,
      permissionLevel: data.permissionLevel,
      joinDate: new Date().toISOString().split('T')[0],
      notes: data.notes,
      isActive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockUsers.unshift(newUser);
    return newUser;
  }

  static async updateUser(data: UpdateUserData): Promise<InternalUser> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const userIndex = mockUsers.findIndex(user => user.id === data.id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const existingUser = mockUsers[userIndex];
    const updatedUser: InternalUser = {
      ...existingUser,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    mockUsers[userIndex] = updatedUser;
    return updatedUser;
  }

  static async deleteUser(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const userIndex = mockUsers.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return false;
    }

    mockUsers.splice(userIndex, 1);
    return true;
  }

  static async assignRoles(userId: string, roles: string[]): Promise<InternalUser> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userIndex = mockUsers.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // For simplicity, we'll just update the primary role with the first role
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      role: roles[0] || mockUsers[userIndex].role,
      updatedAt: new Date().toISOString(),
    };

    return mockUsers[userIndex];
  }

  static async updateUserStatus(userId: string, status: UserStatus): Promise<InternalUser> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const userIndex = mockUsers.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      status,
      isActive: status === UserStatus.ACTIVE,
      updatedAt: new Date().toISOString(),
    };

    return mockUsers[userIndex];
  }

  static async getUserActivities(userId: string): Promise<UserActivity[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockUserActivities.filter(activity => activity.userId === userId);
  }

  static async getUserSessions(userId: string): Promise<UserSession[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockUserSessions.filter(session => session.userId === userId);
  }
}