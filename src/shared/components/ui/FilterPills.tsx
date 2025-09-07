import { forwardRef } from "react";
import { X, Filter } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/utils/cn";

export interface FilterPill {
  id: string;
  label: string;
  value: string | number | boolean;
  category?: string;
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'destructive';
  removable?: boolean;
}

interface FilterPillsProps {
  filters: FilterPill[];
  onRemoveFilter: (filterId: string) => void;
  onClearAll?: () => void;
  showClearAll?: boolean;
  className?: string;
  emptyMessage?: string;
}

export const FilterPills = forwardRef<HTMLDivElement, FilterPillsProps>(
  ({
    filters,
    onRemoveFilter,
    onClearAll,
    showClearAll = true,
    className,
    emptyMessage = "No filters applied",
  }, ref) => {
    if (filters.length === 0) {
      return (
        <div ref={ref} className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
          <Filter className="h-4 w-4" />
          <span>{emptyMessage}</span>
        </div>
      );
    }

    const getVariant = (color: FilterPill['color'] = 'default') => {
      switch (color) {
        case 'primary':
          return 'default';
        case 'secondary':
          return 'secondary';
        case 'success':
          return 'secondary';
        case 'warning':
          return 'secondary';
        case 'destructive':
          return 'destructive';
        default:
          return 'secondary';
      }
    };

    const getColorClasses = (color: FilterPill['color'] = 'default') => {
      switch (color) {
        case 'primary':
          return 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20';
        case 'success':
          return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
        case 'warning':
          return 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100';
        case 'destructive':
          return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100';
        default:
          return '';
      }
    };

    return (
      <div ref={ref} className={cn("flex flex-wrap items-center gap-2", className)}>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Filter className="h-3 w-3" />
          <span>Filters:</span>
        </div>
        
        {filters.map((filter) => (
          <Badge
            key={filter.id}
            variant={getVariant(filter.color)}
            className={cn(
              "gap-1 pr-1 pl-2 text-xs cursor-default transition-colors",
              getColorClasses(filter.color)
            )}
          >
            <div className="flex items-center gap-1">
              {filter.category && (
                <span className="text-muted-foreground">{filter.category}:</span>
              )}
              <span className="font-medium">{filter.label}</span>
            </div>
            
            {filter.removable !== false && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveFilter(filter.id)}
                className="h-4 w-4 p-0 hover:bg-black/10 ml-1"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </Badge>
        ))}
        
        {showClearAll && filters.length > 1 && onClearAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}
      </div>
    );
  }
);

FilterPills.displayName = "FilterPills";