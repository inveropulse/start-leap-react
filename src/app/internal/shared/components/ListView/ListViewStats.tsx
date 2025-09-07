import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EnhancedStatCard } from "@/shared/components/ui/EnhancedStatCard";
import { AnimatedList } from "@/shared/components/ui/AnimatedList";
import { useListViewTheme } from "../../hooks/useListViewTheme";
import { ListViewStatsProps, ListViewStat } from "@/shared/types/ui/listView.types";

// Convert ListViewStat to EnhancedStatCard props
const convertStatToEnhanced = (stat: ListViewStat) => {
  return {
    id: stat.id,
    label: stat.label,
    value: stat.value,
    icon: stat.icon,
    color: stat.color,
    description: stat.description,
    animated: true,
  };
};

export function ListViewStats({ stats, isLoading }: ListViewStatsProps) {
  const theme = useListViewTheme();

  if (isLoading) {
    return (
      <AnimatedList animation="stagger" staggerDelay={100}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
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
      </AnimatedList>
    );
  }

  return (
    <AnimatedList 
      animation="stagger" 
      staggerDelay={75}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {stats.map((stat) => (
        <EnhancedStatCard
          key={stat.id}
          {...convertStatToEnhanced(stat)}
        />
      ))}
    </AnimatedList>
  );
}