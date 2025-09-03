import { Users, Eye, Calendar } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useCalendarStore } from "../../store/calendarStore";
import { PortalType } from "@/shared/types";

export function MobileStatsCards() {
  const { selectedSedationistIds, sedationists, viewMode } = useCalendarStore(PortalType.INTERNAL);

  const stats = [
    {
      icon: Users,
      value: selectedSedationistIds.length,
      label: "Selected",
    },
    {
      icon: Eye,
      value: sedationists?.length || 0,
      label: "Available",
    },
    {
      icon: Calendar,
      value: viewMode,
      label: "Day View",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border-2">
            <CardContent className="p-4 text-center">
              <div className="flex flex-col items-center gap-2">
                <Icon className="h-5 w-5 text-primary" />
                <div className="text-lg font-bold">
                  {typeof stat.value === 'string' ? stat.value : stat.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}