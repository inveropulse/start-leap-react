import { useState } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Clock, User, Calendar } from "lucide-react";
import { DiaryAvailabilityDto } from "@/api/generated/models/DiaryAvailabilityDto";
import { 
  getAvailabilityStatusText, 
  formatAvailabilityTime,
  getAvailabilitySummary,
  getAvailabilityLayoutMode
} from "../utils/availabilityUtils";
import { cn } from "@/shared/utils/cn";

interface AvailabilityCardProps {
  availability: DiaryAvailabilityDto;
  className?: string;
  size?: "sm" | "md" | "lg";
  fullHeight?: number; // Height in pixels for spanning multiple slots
  onClick?: () => void;
}

export function AvailabilityCard({ 
  availability, 
  className, 
  size = "md",
  fullHeight,
  onClick 
}: AvailabilityCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const statusText = getAvailabilityStatusText(availability.status);
  const timeText = formatAvailabilityTime(availability.start, availability.end);
  const summary = getAvailabilitySummary(availability);
  const layoutMode = getAvailabilityLayoutMode(fullHeight);

  const cardSizes = {
    sm: "p-2 text-xs",
    md: "p-3 text-sm",
    lg: "p-4 text-sm"
  };

  const adaptiveSizes = {
    compact: "p-1 text-xs",
    normal: "p-2 text-xs",
    expanded: cardSizes[size]
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 border-l-4 border-l-purple-500",
        "bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/50 dark:hover:bg-purple-900/50",
        isHovered && "shadow-md transform scale-[1.02]",
        onClick && "hover:shadow-lg",
        fullHeight && "absolute top-0 left-0 right-0 z-10",
        className
      )}
      style={fullHeight ? { height: `${fullHeight}px` } : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <CardContent className={fullHeight ? adaptiveSizes[layoutMode] : cardSizes[size]}>
        {layoutMode === 'compact' && (
          <div className="h-full flex flex-col justify-center space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground truncate flex-1 pr-1 text-xs leading-tight">
                {availability.sedationistName || "Available"}
              </span>
              <Badge 
                variant="secondary" 
                className="text-[8px] px-1 py-0 shrink-0 bg-purple-500 text-white hover:bg-purple-600"
              >
                {statusText}
              </Badge>
            </div>
            <div className="text-[10px] text-muted-foreground">
              {timeText}
            </div>
          </div>
        )}

        {layoutMode === 'normal' && (
          <div className="space-y-1 h-full flex flex-col justify-center">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground font-medium">{timeText}</span>
              <Badge 
                variant="secondary" 
                className="text-[10px] px-1 py-0 bg-purple-500 text-white hover:bg-purple-600"
              >
                {statusText}
              </Badge>
            </div>
            <div className="font-semibold text-foreground truncate text-xs">
              {availability.sedationistName || "Available"}
            </div>
          </div>
        )}

        {layoutMode === 'expanded' && (
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
        )}
      </CardContent>
    </Card>
  );
}