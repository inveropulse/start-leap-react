import { forwardRef, useState } from "react";
import { CalendarDays, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { cn } from "@/shared/utils/cn";
import { format, isValid } from "date-fns";

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateRangePickerProps {
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const DateRangePicker = forwardRef<HTMLButtonElement, DateRangePickerProps>(
  ({
    value,
    onChange,
    placeholder = "Select date range",
    disabled = false,
    className,
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false);

    const formatRange = (range?: DateRange) => {
      if (!range?.from) return placeholder;
      
      if (!range.to) {
        return isValid(range.from) ? format(range.from, "MMM d, yyyy") : placeholder;
      }
      
      if (isValid(range.from) && isValid(range.to)) {
        return `${format(range.from, "MMM d")} - ${format(range.to, "MMM d, yyyy")}`;
      }
      
      return placeholder;
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(undefined);
    };

    const hasValue = value?.from || value?.to;

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            className={cn(
              "justify-start text-left font-normal",
              !hasValue && "text-muted-foreground",
              className
            )}
            disabled={disabled}
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            <span className="flex-1 truncate">{formatRange(value)}</span>
            {hasValue && (
              <X
                className="ml-2 h-4 w-4 hover:text-destructive"
                onClick={handleClear}
              />
            )}
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={(range) => {
              onChange(range as DateRange);
              if (range?.from && range?.to) {
                setIsOpen(false);
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    );
  }
);

DateRangePicker.displayName = "DateRangePicker";