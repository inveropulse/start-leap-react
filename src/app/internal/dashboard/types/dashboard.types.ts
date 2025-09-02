export interface DashboardMetric {
  id: string;
  label: string;
  value: number;
  previousValue?: number;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: string;
  color: 'emerald' | 'amber' | 'rose' | 'violet' | 'cyan' | 'orange';
  unit?: string;
  description?: string;
}

export interface ChartDataPoint {
  month: string;
  value: number;
}

export interface RevenueChartData {
  data: ChartDataPoint[];
  totalRevenue: number;
  previousTotalRevenue: number;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
}

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  color: 'emerald' | 'blue' | 'violet' | 'rose' | 'amber';
  onClick: () => void;
}

export interface ActivityItem {
  id: string;
  type: 'appointment' | 'patient' | 'system' | 'alert';
  title: string;
  description: string;
  timestamp: Date;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  icon: string;
}

export interface AppointmentItem {
  id: string;
  reference: string;
  patientTitle?: string;
  patientName: string;
  clinicName: string;
  doctorName?: string;
  sedationistName: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'attention';
  startTime: Date;
  endTime: Date;
  procedure?: string;
  type: 'upcoming' | 'cancelled' | 'attention';
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  icon: string;
  requiresAttention?: boolean;
  attentionReason?: string;
}

export interface DashboardData {
  metrics: DashboardMetric[];
  quickActions: QuickAction[];
  recentActivity: ActivityItem[];
  appointments: AppointmentItem[];
  revenueChart: RevenueChartData;
}