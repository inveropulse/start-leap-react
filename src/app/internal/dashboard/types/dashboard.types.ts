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

export interface DashboardData {
  metrics: DashboardMetric[];
  quickActions: QuickAction[];
  recentActivity: ActivityItem[];
}