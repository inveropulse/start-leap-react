import { Card, CardContent } from "@/shared/components/ui/card";
import { cn } from "@/shared/utils/cn";
import type { QuickAction } from "../types/dashboard.types";
import { 
  UserPlus, 
  CalendarPlus, 
  BarChart3, 
  Settings
} from "lucide-react";

const iconMap = {
  UserPlus,
  CalendarPlus,
  BarChart3,
  Settings,
};

const colorVariants = {
  emerald: {
    card: "hover:bg-gradient-to-br hover:from-emerald-50 hover:to-emerald-100 hover:border-emerald-200",
    icon: "bg-emerald-500 text-white group-hover:bg-emerald-600",
    text: "text-emerald-700",
    accent: "text-emerald-600"
  },
  blue: {
    card: "hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 hover:border-blue-200",
    icon: "bg-blue-500 text-white group-hover:bg-blue-600",
    text: "text-blue-700",
    accent: "text-blue-600"
  },
  violet: {
    card: "hover:bg-gradient-to-br hover:from-violet-50 hover:to-violet-100 hover:border-violet-200",
    icon: "bg-violet-500 text-white group-hover:bg-violet-600",
    text: "text-violet-700",
    accent: "text-violet-600"
  },
  amber: {
    card: "hover:bg-gradient-to-br hover:from-amber-50 hover:to-amber-100 hover:border-amber-200",
    icon: "bg-amber-500 text-white group-hover:bg-amber-600",
    text: "text-amber-700",
    accent: "text-amber-600"
  },
  rose: {
    card: "hover:bg-gradient-to-br hover:from-rose-50 hover:to-rose-100 hover:border-rose-200",
    icon: "bg-rose-500 text-white group-hover:bg-rose-600",
    text: "text-rose-700",
    accent: "text-rose-600"
  }
};

interface QuickActionCardProps {
  action: QuickAction;
  className?: string;
  style?: React.CSSProperties;
}

export const QuickActionCard = ({ action, className, style }: QuickActionCardProps) => {
  const IconComponent = iconMap[action.icon as keyof typeof iconMap];
  const colors = colorVariants[action.color];

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer group border bg-card",
        colors.card,
        className
      )}
      onClick={action.onClick}
      style={style}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={cn(
            "h-12 w-12 rounded-lg flex items-center justify-center shadow-sm transition-all duration-300 group-hover:scale-110",
            colors.icon
          )}>
            {IconComponent && <IconComponent className="h-6 w-6" />}
          </div>
          
          <div className="flex-1">
            <h3 className={cn("font-semibold text-lg", colors.text)}>
              {action.label}
            </h3>
            <p className="text-sm text-muted-foreground">
              {action.description}
            </p>
          </div>
        </div>
        
        {/* Animated background accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </CardContent>
    </Card>
  );
};