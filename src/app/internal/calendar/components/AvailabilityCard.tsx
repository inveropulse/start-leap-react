import { useState } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Clock, User, Calendar } from "lucide-react";
import { DiaryAvailabilityDto } from "@/api/generated/models/DiaryAvailabilityDto";
import { 
  getAvailabilityStatusText, 
  formatAvailabilityTime,
  getAvailabilitySummary 
} from "../utils/availabilityUtils";
import { cn } from "@/shared/utils/cn";

interface AvailabilityCardProps {
  availability: DiaryAvailabilityDto;
  className?: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

export function AvailabilityCard({ 
  availability, 
  className, 
  size = "md",
  onClick 
}: AvailabilityCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const statusText = getAvailabilityStatusText(availability.status);
  const timeText = formatAvailabilityTime(availability.start, availability.end);
  const summary = getAvailabilitySummary(availability);

  const cardSizes = {
    sm: "p-2 text-xs",
    md: "p-3 text-sm",
    lg: "p-4 text-sm"
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 border-l-4 border-l-purple-500",
        "bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/50 dark:hover:bg-purple-900/50",
        isHovered && "shadow-md transform scale-[1.02]",
        onClick && "hover:shadow-lg",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <CardContent className={cardSizes[size]}>
        <div className="space-y-2">
          {/* Header with time and status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span className="font-medium">{timeText}</span>
            </div>
            <Badge 
              variant="secondary" 
              className="text-xs bg-purple-500 text-white hover:bg-purple-600"
            >
              {statusText}
            </Badge>
          </div>

          {/* Sedationist info */}
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3 text-muted-foreground" />
              <span className="font-semibold text-foreground truncate">
                {availability.sedationistName || "Unknown Sedationist"}
              </span>
            </div>
            
            {availability.status && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground truncate">
                  {statusText}
                </span>
              </div>
            )}
          </div>

          {/* Notes for larger cards */}
          {size === "lg" && availability.notes && (
            <div className="text-xs text-muted-foreground">
              {availability.notes}
            </div>
          )}

          {/* ID for smaller cards */}
          {size !== "lg" && availability.id && (
            <div className="text-xs text-muted-foreground">
              ID: {availability.id.split('-').pop()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}