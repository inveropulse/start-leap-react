import { DashboardData, DashboardMetric, QuickAction, ActivityItem, AppointmentItem, RevenueChartData, ChartDataPoint } from '../types/dashboard.types';
import { Title } from '../../../../api/generated/models/Title';
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

export const mockAppointments: AppointmentItem[] = [
  {
    id: '1',
    reference: 'APP-2024-001',
    patientTitle: Title.MRS,
    patientName: 'Sarah Johnson',
    clinicName: 'Harley Street Dental',
    doctorTitle: 'Dr',
    doctorName: 'Emily Watson',
    sedationistTitle: 'Dr',
    sedationistName: 'Michael Chen',
    status: 'confirmed',
    startTime: new Date(2024, 0, 15, 9, 0),
    endTime: new Date(2024, 0, 15, 10, 30),
    procedure: 'Root Canal Treatment',
    type: 'upcoming',
    color: 'green',
    icon: 'Calendar'
  },
  {
    id: '2',
    reference: 'APP-2024-002',
    patientTitle: Title.MR,
    patientName: 'James Wilson',
    clinicName: 'City Dental Practice',
    doctorTitle: 'Dr',
    doctorName: 'Robert Smith',
    sedationistTitle: 'Dr',
    sedationistName: 'Sarah Lee',
    status: 'pending',
    startTime: new Date(2024, 0, 15, 14, 0),
    endTime: new Date(2024, 0, 15, 15, 0),
    procedure: 'Wisdom Tooth Extraction',
    type: 'upcoming',
    color: 'blue',
    icon: 'Clock'
  },
  {
    id: '3',
    reference: 'APP-2024-003',
    patientTitle: Title.MS,
    patientName: 'Maria Garcia',
    clinicName: 'Premier Dental Clinic',
    doctorTitle: 'Dr',
    doctorName: 'Amanda Brown',
    sedationistTitle: 'Dr',
    sedationistName: 'Patricia Williams',
    status: 'attention',
    startTime: new Date(2024, 0, 16, 10, 0),
    endTime: new Date(2024, 0, 16, 11, 30),
    procedure: 'Dental Implant',
    type: 'attention',
    color: 'yellow',
    icon: 'AlertTriangle',
    requiresAttention: true,
    attentionReason: 'Payment pending confirmation'
  },
  {
    id: '4',
    reference: 'APP-2024-004',
    patientTitle: Title.MR,
    patientName: 'David Thompson',
    clinicName: 'Modern Dental Solutions',
    doctorTitle: 'Dr',
    doctorName: 'Lisa Chang',
    sedationistTitle: 'Prof',
    sedationistName: 'James Miller',
    status: 'attention',
    startTime: new Date(2024, 0, 16, 15, 30),
    endTime: new Date(2024, 0, 16, 16, 30),
    procedure: 'Oral Surgery',
    type: 'attention',
    color: 'red',
    icon: 'AlertCircle',
    requiresAttention: true,
    attentionReason: 'Patient pack incomplete'
  },
  {
    id: '5',
    reference: 'APP-2024-005',
    patientTitle: Title.MISS,
    patientName: 'Emma Taylor',
    clinicName: 'Gentle Care Dentistry',
    doctorTitle: 'Dr',
    doctorName: 'Peter Wilson',
    sedationistTitle: 'Ms',
    sedationistName: 'Anna Rodriguez',
    status: 'cancelled',
    startTime: new Date(2024, 0, 17, 11, 0),
    endTime: new Date(2024, 0, 17, 12, 0),
    procedure: 'Periodontal Treatment',
    type: 'cancelled',
    color: 'red',
    icon: 'X'
  },
  {
    id: '6',
    reference: 'APP-2024-006',
    patientTitle: Title.MR,
    patientName: 'Oliver Martinez',
    clinicName: 'Excellence Dental Care',
    doctorTitle: 'Mr',
    doctorName: 'Helen Davis',
    sedationistTitle: 'Dr',
    sedationistName: 'Thomas Anderson',
    status: 'confirmed',
    startTime: new Date(2024, 0, 18, 13, 0),
    endTime: new Date(2024, 0, 18, 14, 30),
    procedure: 'Endodontic Therapy',
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