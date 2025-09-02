import { DashboardData, DashboardMetric, QuickAction, ActivityItem, AppointmentItem, RevenueChartData, ChartDataPoint } from '../types/dashboard.types';
import { formatCurrency } from '@/shared/utils/currency';

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
    icon: 'PoundSterling',
    color: 'rose',
    unit: '£',
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

// Mock revenue chart data
const generateRevenueChartData = (): RevenueChartData => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Create more realistic revenue data with seasonal trends
  const baseValues = [
    95000,  // Jan - slower start
    102000, // Feb - slight increase
    118000, // Mar - spring growth
    125000, // Apr - good month
    130000, // May - peak spring
    115000, // Jun - summer dip
    108000, // Jul - summer continues
    112000, // Aug - slight recovery
    135000, // Sep - back to business
    142000, // Oct - strong autumn
    155000, // Nov - pre-holiday surge
    138000  // Dec - holiday season
  ];
  
  const data: ChartDataPoint[] = months.map((month, index) => ({
    month,
    value: baseValues[index] + Math.floor((Math.random() - 0.5) * 10000) // Add some variation
  }));

  const totalRevenue = data.reduce((sum, point) => sum + point.value, 0);
  const previousTotalRevenue = Math.floor(totalRevenue * 0.92); // 8% less than current
  const change = ((totalRevenue - previousTotalRevenue) / previousTotalRevenue) * 100;

  return {
    data,
    totalRevenue,
    previousTotalRevenue,
    change: Math.round(change * 10) / 10,
    changeType: change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral'
  };
};

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

const mockAppointments: AppointmentItem[] = [
  // Upcoming confirmed appointments
  {
    id: 'apt-001',
    reference: 'REF-2024-001',
    patientName: 'Sarah Wilson',
    clinicName: 'City Dental Clinic',
    doctorName: 'Johnson',
    sedationistName: 'Dr. Smith',
    status: 'confirmed',
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    endTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
    procedure: 'Wisdom tooth extraction with sedation',
    type: 'upcoming',
    color: 'green',
    icon: 'Calendar'
  },
  {
    id: 'apt-002',
    reference: 'REF-2024-002',
    patientName: 'Michael Brown',
    clinicName: 'Harley Street Dental',
    doctorName: 'Davis',
    sedationistName: undefined,
    status: 'attention',
    startTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    endTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
    procedure: 'Root canal treatment',
    type: 'attention',
    color: 'yellow',
    icon: 'AlertTriangle',
    requiresAttention: true,
    attentionReason: 'Sedationist not assigned'
  },
  {
    id: 'apt-003',
    reference: 'REF-2024-003',
    patientName: 'Emma Thompson',
    clinicName: 'Brighton Dental Care',
    doctorName: 'Williams',
    sedationistName: 'Dr. Jones',
    status: 'pending',
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    endTime: new Date(Date.now() + 25 * 60 * 60 * 1000),
    procedure: 'Multiple extractions',
    type: 'upcoming',
    color: 'blue',
    icon: 'Clock'
  },
  // Recently cancelled appointments
  {
    id: 'apt-004',
    reference: 'REF-2024-004',
    patientName: 'James Miller',
    clinicName: 'Oxford Street Dental',
    doctorName: 'Taylor',
    sedationistName: 'Dr. Wilson',
    status: 'cancelled',
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago (was scheduled)
    endTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
    procedure: 'Implant placement',
    type: 'cancelled',
    color: 'red',
    icon: 'X'
  },
  {
    id: 'apt-005',
    reference: 'REF-2024-005',
    patientName: 'Lisa Garcia',
    clinicName: 'West End Dental Practice',
    doctorName: 'Anderson',
    sedationistName: undefined,
    status: 'attention',
    startTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // Day after tomorrow
    endTime: new Date(Date.now() + 49 * 60 * 60 * 1000),
    procedure: 'Oral surgery consultation',
    type: 'attention',
    color: 'yellow',
    icon: 'AlertTriangle',
    requiresAttention: true,
    attentionReason: 'Patient pack incomplete'
  },
  {
    id: 'apt-006',
    reference: 'REF-2024-006',
    patientName: 'Robert Lee',
    clinicName: 'Central London Dental',
    doctorName: 'Martinez',
    sedationistName: 'Dr. Brown',
    status: 'confirmed',
    startTime: new Date(Date.now() + 26 * 60 * 60 * 1000), // Tomorrow afternoon
    endTime: new Date(Date.now() + 27 * 60 * 60 * 1000),
    procedure: 'Sedation for anxiety management',
    type: 'upcoming',
    color: 'green',
    icon: 'Calendar'
  }
];

// Simulate API call with loading time
export const getMockDashboardData = (): Promise<DashboardData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        metrics: mockMetrics,
        quickActions: mockQuickActions,
        recentActivity: mockRecentActivity,
        appointments: mockAppointments,
        revenueChart: generateRevenueChartData()
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