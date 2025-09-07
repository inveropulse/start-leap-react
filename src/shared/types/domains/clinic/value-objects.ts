// Clinic value objects
export interface ClinicUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Pending';
  lastLogin?: string;
}

export interface ClinicActivity {
  id: string;
  type: 'Created' | 'Updated' | 'Doctor Added' | 'Doctor Removed' | 'Status Changed';
  description: string;
  performedBy: string;
  timestamp: string;
  details?: Record<string, any>;
}

export interface ClinicManagementData {
  clinic: import('./entities').Clinic;
  doctors: import('./entities').ClinicDoctor[];
  users: ClinicUser[];
  activities: ClinicActivity[];
}