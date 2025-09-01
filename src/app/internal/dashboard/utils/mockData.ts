import { DashboardData, DashboardMetric, QuickAction, ActivityItem } from '../types/dashboard.types';

// Mock metrics data with vibrant colors
const mockMetrics: DashboardMetric[] = [
  {
    id: 'total-patients',
    label: 'Total Patients',
    value: 12847,
    previousValue: 12103,
    change: 6.1,
    changeType: 'positive',
    icon: 'Users',
    color: 'emerald',
    description: 'Active patients in the system'
  },
  {
    id: 'appointments-today',
    label: "Today's Appointments",
    value: 34,
    previousValue: 28,
    change: 21.4,
    changeType: 'positive',
    icon: 'Calendar',
    color: 'cyan',
    description: 'Scheduled appointments for today'
  },
  {
    id: 'pending-approvals',
    label: 'Pending Approvals',
    value: 8,
    previousValue: 15,
    change: -46.7,
    changeType: 'positive',
    icon: 'Clock',
    color: 'amber',
    description: 'Items awaiting approval'
  },
  {
    id: 'active-clinics',
    label: 'Active Clinics',
    value: 23,
    previousValue: 22,
    change: 4.5,
    changeType: 'positive',
    icon: 'Building2',
    color: 'violet',
    description: 'Currently operational clinics'
  },
  {
    id: 'revenue-month',
    label: 'Monthly Revenue',
    value: 124500,
    previousValue: 118200,
    change: 5.3,
    changeType: 'positive',
    icon: 'DollarSign',
    color: 'rose',
    unit: '$',
    description: 'Revenue for current month'
  },
  {
    id: 'completion-rate',
    label: 'Completion Rate',
    value: 94.2,
    previousValue: 91.8,
    change: 2.6,
    changeType: 'positive',
    icon: 'TrendingUp',
    color: 'orange',
    unit: '%',
    description: 'Appointment completion rate'
  }
];

const mockQuickActions: QuickAction[] = [
  {
    id: 'add-patient',
    label: 'Add Patient',
    description: 'Register a new patient',
    icon: 'UserPlus',
    color: 'emerald',
    onClick: () => console.log('Add patient clicked') // TODO: Replace with actual navigation
  },
  {
    id: 'schedule-appointment',
    label: 'Schedule Appointment',
    description: 'Book a new appointment',
    icon: 'CalendarPlus',
    color: 'blue',
    onClick: () => console.log('Schedule appointment clicked') // TODO: Replace with actual navigation
  },
  {
    id: 'view-reports',
    label: 'View Reports',
    description: 'Access analytics and reports',
    icon: 'BarChart3',
    color: 'violet',
    onClick: () => console.log('View reports clicked') // TODO: Replace with actual navigation
  },
  {
    id: 'manage-clinics',
    label: 'Manage Clinics',
    description: 'Clinic administration',
    icon: 'Settings',
    color: 'amber',
    onClick: () => console.log('Manage clinics clicked') // TODO: Replace with actual navigation
  }
];

const mockRecentActivity: ActivityItem[] = [
  {
    id: '1',
    type: 'patient',
    title: 'New Patient Registration',
    description: 'John Smith registered as a new patient',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    color: 'green',
    icon: 'UserPlus'
  },
  {
    id: '2',
    type: 'appointment',
    title: 'Appointment Scheduled',
    description: 'Dr. Johnson - Sarah Wilson, tomorrow 2:00 PM',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    color: 'blue',
    icon: 'Calendar'
  },
  {
    id: '3',
    type: 'system',
    title: 'System Update',
    description: 'Patient portal maintenance completed',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    color: 'purple',
    icon: 'Settings'
  },
  {
    id: '4',
    type: 'alert',
    title: 'Payment Overdue',
    description: 'Invoice #12847 requires attention',
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    color: 'red',
    icon: 'AlertTriangle'
  },
  {
    id: '5',
    type: 'appointment',
    title: 'Appointment Cancelled',
    description: 'Mike Brown cancelled appointment for today',
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    color: 'yellow',
    icon: 'X'
  }
];

// Simulate API call with loading time
export const getMockDashboardData = (): Promise<DashboardData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        metrics: mockMetrics,
        quickActions: mockQuickActions,
        recentActivity: mockRecentActivity
      });
    }, 800); // Simulate network delay
  });
};

// Function to add random variation to metrics (simulates real-time updates)
export const getVariedMetrics = (): DashboardMetric[] => {
  return mockMetrics.map(metric => ({
    ...metric,
    value: Math.floor(metric.value + (Math.random() - 0.5) * metric.value * 0.1) // ±10% variation
  }));
};