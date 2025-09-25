// User access value objects
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
