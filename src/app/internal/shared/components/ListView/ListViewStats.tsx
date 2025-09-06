import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useListViewTheme } from "../../hooks/useListViewTheme";
import { ListViewStatsProps } from "../../types/listView.types";

const getStatColorClass = (color?: 'default' | 'success' | 'warning' | 'primary') => {
  switch (color) {
    case 'success':
      return 'text-green-600';
    case 'warning':
      return 'text-orange-600';
    case 'primary':
      return 'text-portal-internal-primary';
    default:
      return 'text-foreground';
  }
};

const getStatBgClass = (color?: 'default' | 'success' | 'warning' | 'primary') => {
  switch (color) {
    case 'success':
      return 'bg-green-50 border-green-200';
    case 'warning':
      return 'bg-orange-50 border-orange-200';
    case 'primary':
      return 'bg-portal-internal-secondary border-portal-internal-accent/20';
    default:
      return 'bg-card border-border';
  }
};

export function ListViewStats({ stats, isLoading }: ListViewStatsProps) {
  const theme = useListViewTheme();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-16 mb-1" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const IconComponent = stat.icon;
        const statColorClass = getStatColorClass(stat.color);
        const statBgClass = getStatBgClass(stat.color);
        
        return (
          <Card key={stat.id} className={statBgClass}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              {IconComponent && (
                <IconComponent className={`h-4 w-4 ${statColorClass}`} />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${statColorClass}`}>
                {stat.value}
              </div>
              {stat.description && (
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}