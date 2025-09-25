import { useGetUsersStatsRequest } from "@/api/user-management";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Users, UserCheck, UserX, Shield } from "lucide-react";

/**
 * High cohesion component that manages its own stats data fetching
 * Follows Single Responsibility Principle - only responsible for displaying user stats
 */
export default function ListViewStats() {
  const {
    data: stats,
    isPending: isLoading,
    error,
  } = useGetUsersStatsRequest();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </CardTitle>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-12"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-gray-500 py-4">
        Unable to load user statistics
      </div>
    );
  }

  const statsData = stats?.data || {
    total: 0,
    active: 0,
    pending: 0,
    admins: 0,
  };

  const statCards = [
    {
      title: "Total Users",
      value: statsData.total,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Active Users",
      value: statsData.active,
      icon: UserCheck,
      color: "text-green-600",
    },
    {
      title: "Pending Users",
      value: statsData.pending,
      icon: UserX,
      color: "text-yellow-600",
    },
    {
      title: "Administrators",
      value: statsData.admins,
      icon: Shield,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {statCards.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <IconComponent className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
