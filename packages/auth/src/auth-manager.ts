import type { User, LoginCredentials, PortalType } from "./types";

// Simple authentication manager
export class AuthManager {
  // Mock user data for development
  private mockUsers: User[] = [
    {
      id: "1",
      email: "admin@example.com",
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      permissions: {
        internal: true,
        patient: true,
        sedationist: true,
        clinic: true,
      },
      defaultPortal: "internal",
      isActive: true,
    },
    {
      id: "2",
      email: "patient@example.com",
      firstName: "Patient",
      lastName: "User",
      role: "patient",
      permissions: {
        internal: false,
        patient: true,
        sedationist: false,
        clinic: false,
      },
      defaultPortal: "patient",
      isActive: true,
    },
  ];

  async login(
    credentials: LoginCredentials
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    const user = this.mockUsers.find((u) => u.email === credentials.email);

    if (!user) {
      return { success: false, error: "User not found" };
    }

    if (!user.isActive) {
      return { success: false, error: "Account inactive" };
    }

    // In a real app, verify password here
    return { success: true, user };
  }

  getCurrentUser(): User | null {
    // In a real app, get from JWT token or session
    return null;
  }

  logout(): void {
    // Clear session/token
  }
}
