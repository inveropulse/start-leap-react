import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { cn } from "@/shared/utils/cn";
import type { ActivityItem } from "../types/dashboard.types";
import { 
  UserPlus, 
  Calendar, 
  Settings, 
  AlertTriangle, 
  X 
} from "lucide-react";

const iconMap = {
  UserPlus,
  Calendar,
  Settings,
  AlertTriangle,
  X,
};

const colorVariants = {
  blue: {
    icon: "bg-blue-100 text-blue-600",
    dot: "bg-blue-500"
  },
  green: {
    icon: "bg-emerald-100 text-emerald-600", 
    dot: "bg-emerald-500"
  },
  yellow: {
    icon: "bg-amber-100 text-amber-600",
    dot: "bg-amber-500"
  },
  red: {
    icon: "bg-red-100 text-red-600",
    dot: "bg-red-500"
  },
  purple: {
    icon: "bg-violet-100 text-violet-600",
    dot: "bg-violet-500"
  }
};

interface ActivityFeedProps {
  activities: ActivityItem[];
  className?: string;
  style?: React.CSSProperties;
}

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

const ActivityItemComponent = ({ activity, isLast }: { activity: ActivityItem; isLast: boolean }) => {
  const IconComponent = iconMap[activity.icon as keyof typeof iconMap];
  const colors = colorVariants[activity.color];
  
  return (
    <div className="relative flex items-start gap-4 p-4 group hover:bg-muted/50 transition-colors duration-200">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-8 top-12 w-px h-full bg-border" />
      )}
      
      {/* Icon */}
      <div className={cn(
        "relative z-10 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110",
        colors.icon
      )}>
        {IconComponent && <IconComponent className="h-4 w-4" />}
        {/* Status dot */}
        <div className={cn("absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white", colors.dot)} />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h4 className="font-medium text-sm text-foreground">
              {activity.title}
            </h4>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {activity.description}
            </p>
          </div>
          <time className="text-xs text-muted-foreground flex-shrink-0">
            {formatTimeAgo(activity.timestamp)}
          </time>
        </div>
      </div>
    </div>
  );
};

export const ActivityFeed = ({ activities, className, style }: ActivityFeedProps) => {
  return (
    <Card className={cn("", className)} style={style}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {activities.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No recent activity</p>
            </div>
          ) : (
            activities.map((activity, index) => (
              <ActivityItemComponent 
                key={activity.id} 
                activity={activity} 
                isLast={index === activities.length - 1}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};