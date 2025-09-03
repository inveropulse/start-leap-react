import { Card, CardContent } from "@/shared/components/ui/card";
import { useCalendarStore } from "../../store/calendarStore";
import { PortalType } from "@/shared/types";
import { Users, Eye, Calendar } from "lucide-react";

export function MobileStatsCards() {
  const { selectedSedationistIds, sedationists } = useCalendarStore(PortalType.INTERNAL);

  const availableSedationists = sedationists?.length || 0;
  const selectedCount = selectedSedationistIds.length;

  const stats = [
    {
      label: "Selected",
      value: selectedCount,
      icon: Users,
      color: "text-primary",
    },
    {
      label: "Available",
      value: availableSedationists,
      icon: Eye,
      color: "text-muted-foreground",
    },
    {
      label: "Day View",
      value: "",
      icon: Calendar,
      color: "text-muted-foreground",
      isText: true,
    },
  ];

  return (
    <div className="flex gap-2 px-4 overflow-x-auto pb-2">
      {stats.map((stat, index) => (
        <Card key={index} className="flex-shrink-0 min-w-[100px]">
          <CardContent className="p-3">
            <div className="flex flex-col items-center text-center">
              <stat.icon className={`h-4 w-4 mb-1 ${stat.color}`} />
              <div className="text-lg font-semibold">
                {stat.isText ? "Day" : stat.value}
              </div>
              <div className="text-xs text-muted-foreground">
                {stat.label}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}