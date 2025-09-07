import { forwardRef, useState, useRef, useEffect } from "react";
import { Check, ChevronDown, X, Search } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { cn } from "@/shared/utils/cn";

export interface SelectOption {
  value: string;
  label: string;
  count?: number;
  disabled?: boolean;
  group?: string;
}

interface MultiSelectProps {
  options: SelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  maxDisplay?: number;
  showSearch?: boolean;
  showSelectAll?: boolean;
  disabled?: boolean;
  className?: string;
}

export const MultiSelect = forwardRef<HTMLButtonElement, MultiSelectProps>(
  ({
    options,
    value,
    onChange,
    placeholder = "Select options...",
    searchPlaceholder = "Search options...",
    maxDisplay = 3,
    showSearch = true,
    showSelectAll = true,
    disabled = false,
    className,
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    // Filter options based on search query
    const filteredOptions = options.filter(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Group options if they have groups
    const groupedOptions = filteredOptions.reduce((groups, option) => {
      const group = option.group || 'Other';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(option);
      return groups;
    }, {} as Record<string, SelectOption[]>);

    // Handle click outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggleOption = (optionValue: string) => {
      const newValue = value.includes(optionValue)
        ? value.filter(v => v !== optionValue)
        : [...value, optionValue];
      onChange(newValue);
    };

    const handleSelectAll = () => {
      const availableOptions = filteredOptions.filter(opt => !opt.disabled);
      const allSelected = availableOptions.every(opt => value.includes(opt.value));
      
      if (allSelected) {
        // Deselect all from filtered options
        const newValue = value.filter(v => 
          !availableOptions.some(opt => opt.value === v)
        );
        onChange(newValue);
      } else {
        // Select all from filtered options
        const newValue = [
          ...value,
          ...availableOptions
            .filter(opt => !value.includes(opt.value))
            .map(opt => opt.value)
        ];
        onChange(newValue);
      }
    };

    const getDisplayText = () => {
      if (value.length === 0) return placeholder;
      
      const selectedOptions = options.filter(opt => value.includes(opt.value));
      
      if (value.length <= maxDisplay) {
        return selectedOptions.map(opt => opt.label).join(', ');
      }
      
      return `${selectedOptions.slice(0, maxDisplay).map(opt => opt.label).join(', ')} +${value.length - maxDisplay} more`;
    };

    const selectedCount = value.length;
    const availableCount = filteredOptions.filter(opt => !opt.disabled).length;
    const allSelected = availableCount > 0 && filteredOptions
      .filter(opt => !opt.disabled)
      .every(opt => value.includes(opt.value));

    return (
      <div ref={containerRef} className={cn("relative w-full", className)}>
        <Button
          ref={ref}
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className="w-full justify-between font-normal"
        >
          <span className="truncate text-left">
            {getDisplayText()}
          </span>
          <div className="flex items-center gap-2">
            {selectedCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {selectedCount}
              </Badge>
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </div>
        </Button>

        {isOpen && (
          <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-80 overflow-hidden shadow-lg">
            <CardContent className="p-0">
              {showSearch && (
                <div className="p-3 border-b">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 h-8"
                    />
                  </div>
                </div>
              )}

              {showSelectAll && filteredOptions.length > 0 && (
                <div className="p-2 border-b">
                  <div
                    className="flex items-center space-x-2 px-2 py-1 rounded cursor-pointer hover:bg-muted/50"
                    onClick={handleSelectAll}
                  >
                    <Checkbox
                      checked={allSelected}
                    />
                    <span className="text-sm font-medium">
                      {allSelected ? 'Deselect All' : 'Select All'}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      ({availableCount})
                    </span>
                  </div>
                </div>
              )}

              <div className="max-h-60 overflow-y-auto">
                {Object.keys(groupedOptions).length === 1 && Object.keys(groupedOptions)[0] === 'Other' ? (
                  // No groups, display flat list
                  <div className="p-1">
                    {filteredOptions.map((option) => (
                      <div
                        key={option.value}
                        className={cn(
                          "flex items-center space-x-2 px-2 py-2 text-sm rounded cursor-pointer",
                          option.disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-muted/50"
                        )}
                        onClick={() => !option.disabled && handleToggleOption(option.value)}
                      >
                        <Checkbox
                          checked={value.includes(option.value)}
                          disabled={option.disabled}
                        />
                        <span className="flex-1">{option.label}</span>
                        {option.count !== undefined && (
                          <Badge variant="outline" className="text-xs">
                            {option.count}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  // Display grouped options
                  <div>
                    {Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
                      <div key={groupName}>
                        {groupName !== 'Other' && (
                          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground bg-muted/30">
                            {groupName}
                          </div>
                        )}
                        <div className="p-1">
                          {groupOptions.map((option) => (
                            <div
                              key={option.value}
                              className={cn(
                                "flex items-center space-x-2 px-2 py-2 text-sm rounded cursor-pointer",
                                option.disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-muted/50"
                              )}
                              onClick={() => !option.disabled && handleToggleOption(option.value)}
                            >
                              <Checkbox
                                checked={value.includes(option.value)}
                                disabled={option.disabled}
                              />
                              <span className="flex-1">{option.label}</span>
                              {option.count !== undefined && (
                                <Badge variant="outline" className="text-xs">
                                  {option.count}
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }
);

MultiSelect.displayName = "MultiSelect";