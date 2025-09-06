import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Activity } from "lucide-react";
import { ClinicActivity } from "../../types/clinic.types";
import { format } from "date-fns";

interface ClinicActivityTabProps {
  activities: ClinicActivity[];
  isLoading: boolean;
}

export function ClinicActivityTab({ activities, isLoading }: ClinicActivityTabProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-muted h-16 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Activity className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Recent Activities ({activities.length})</h3>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <Card key={activity.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {activity.type}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      by {activity.performedBy}
                    </span>
                  </div>
                  <p className="text-sm">{activity.description}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(activity.timestamp), "MMM dd, yyyy HH:mm")}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}