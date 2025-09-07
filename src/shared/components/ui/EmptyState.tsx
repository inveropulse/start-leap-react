import { forwardRef, ReactNode } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";
import { 
  Search, 
  Plus, 
  FileX, 
  Users, 
  Building2, 
  Calendar,
  Settings,
  Lightbulb
} from "lucide-react";

interface EmptyStateProps {
  icon?: 'search' | 'add' | 'file' | 'users' | 'building' | 'calendar' | 'settings' | 'lightbulb' | React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
    icon?: React.ComponentType<{ className?: string }>;
  }>;
  suggestions?: string[];
  children?: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const iconMap = {
  search: Search,
  add: Plus,
  file: FileX,
  users: Users,
  building: Building2,
  calendar: Calendar,
  settings: Settings,
  lightbulb: Lightbulb,
};

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({
    icon = 'file',
    title,
    description,
    actions = [],
    suggestions = [],
    children,
    className,
    size = 'md',
    animated = true,
  }, ref) => {
    const IconComponent = typeof icon === 'string' ? iconMap[icon] : icon;

    const sizeClasses = {
      sm: {
        container: 'py-8',
        icon: 'h-10 w-10',
        title: 'text-lg',
        description: 'text-sm',
      },
      md: {
        container: 'py-12',
        icon: 'h-12 w-12',
        title: 'text-xl',
        description: 'text-base',
      },
      lg: {
        container: 'py-16',
        icon: 'h-16 w-16',
        title: 'text-2xl',
        description: 'text-lg',
      },
    };

    const { container, icon: iconSize, title: titleSize, description: descSize } = sizeClasses[size];

    return (
      <Card ref={ref} className={cn("border-dashed", className)}>
        <CardContent className={cn("text-center", container)}>
          <div className={cn(
            "mx-auto mb-4 rounded-full bg-muted/50 p-3 w-fit",
            animated && "animate-bounce-in"
          )}>
            {IconComponent && (
              <IconComponent className={cn(iconSize, "text-muted-foreground")} />
            )}
          </div>

          <h3 className={cn(
            "font-semibold text-foreground mb-2",
            titleSize,
            animated && "animate-fade-in"
          )}>
            {title}
          </h3>

          <p className={cn(
            "text-muted-foreground mb-6 max-w-md mx-auto",
            descSize,
            animated && "animate-fade-in"
          )}>
            {description}
          </p>

          {actions.length > 0 && (
            <div className={cn(
              "flex flex-col sm:flex-row gap-3 justify-center mb-6",
              animated && "animate-slide-up"
            )}>
              {actions.map((action, index) => {
                const ActionIcon = action.icon;
                return (
                  <Button
                    key={index}
                    variant={action.variant || 'default'}
                    onClick={action.onClick}
                    className="gap-2"
                  >
                    {ActionIcon && <ActionIcon className="h-4 w-4" />}
                    {action.label}
                  </Button>
                );
              })}
            </div>
          )}

          {suggestions.length > 0 && (
            <div className={cn(
              "text-left max-w-md mx-auto",
              animated && "animate-fade-in"
            )}>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium text-muted-foreground">
                  Suggestions:
                </span>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-muted-foreground/60 mt-1">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {children && (
            <div className={cn(
              "mt-6",
              animated && "animate-fade-in"
            )}>
              {children}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

EmptyState.displayName = "EmptyState";