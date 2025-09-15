import { forwardRef, useState, useEffect, useRef, useMemo } from "react";
import { Search, Clock, X, TrendingUp } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/utils/cn";
import { useDebounce } from "@/shared/hooks/useDebounce";

interface SearchSuggestion {
  id: string;
  text: string;
  type: "recent" | "suggestion" | "trending";
  count?: number;
  category?: string;
}

interface SmartSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  recentSearches?: string[];
  onRecentSearch?: (search: string) => void;
  showSuggestions?: boolean;
  fuzzySearch?: boolean;
  maxSuggestions?: number;
  className?: string;
  disabled?: boolean;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const SmartSearchInput = forwardRef<
  HTMLInputElement,
  SmartSearchInputProps
>(
  (
    {
      value,
      onChange,
      placeholder = "Search...",
      suggestions = [],
      recentSearches = [],
      onRecentSearch,
      showSuggestions = true,
      fuzzySearch = true,
      maxSuggestions = 8,
      className,
      disabled = false,
      onKeyDown,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const debouncedValue = useDebounce(value, 150);

    // Filter and combine suggestions
    const filteredSuggestions = useMemo(() => {
      if (!debouncedValue.trim() && recentSearches.length === 0) return [];

      let allSuggestions: SearchSuggestion[] = [];

      // Add recent searches if no current search
      if (!debouncedValue.trim()) {
        allSuggestions = recentSearches.slice(0, 3).map((search) => ({
          id: `recent-${search}`,
          text: search,
          type: "recent" as const,
        }));
      } else {
        // Filter suggestions based on search
        const searchLower = debouncedValue.toLowerCase();

        allSuggestions = suggestions.filter((suggestion) => {
          if (fuzzySearch) {
            // Simple fuzzy matching
            return (
              suggestion.text.toLowerCase().includes(searchLower) ||
              searchLower
                .split("")
                .every((char) => suggestion.text.toLowerCase().includes(char))
            );
          }
          return suggestion.text.toLowerCase().includes(searchLower);
        });

        // Add recent searches that match
        const matchingRecent = recentSearches
          .filter((recent) => recent.toLowerCase().includes(searchLower))
          .slice(0, 2)
          .map((search) => ({
            id: `recent-${search}`,
            text: search,
            type: "recent" as const,
          }));

        allSuggestions = [...matchingRecent, ...allSuggestions];
      }

      return allSuggestions.slice(0, maxSuggestions);
    }, [
      debouncedValue,
      suggestions,
      recentSearches,
      fuzzySearch,
      maxSuggestions,
    ]);

    // Handle click outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setFocusedIndex(-1);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Call external onKeyDown first
      onKeyDown?.(e);

      if (!isOpen || filteredSuggestions.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev < filteredSuggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredSuggestions.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (focusedIndex >= 0) {
            handleSuggestionSelect(filteredSuggestions[focusedIndex]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setFocusedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    };

    const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
      onChange(suggestion.text);
      if (suggestion.type === "recent") {
        onRecentSearch?.(suggestion.text);
      }
      setIsOpen(false);
      setFocusedIndex(-1);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange(newValue);
      if (showSuggestions) {
        setIsOpen(true);
      }
    };

    const handleClear = () => {
      onChange("");
      setIsOpen(false);
      inputRef.current?.focus();
    };

    const getSuggestionIcon = (type: SearchSuggestion["type"]) => {
      switch (type) {
        case "recent":
          return Clock;
        case "trending":
          return TrendingUp;
        default:
          return Search;
      }
    };

    const getSuggestionLabel = (type: SearchSuggestion["type"]) => {
      switch (type) {
        case "recent":
          return "Recent";
        case "trending":
          return "Trending";
        case "suggestion":
          return "Suggestion";
        default:
          return "";
      }
    };

    return (
      <div ref={containerRef} className={cn("relative w-full", className)}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={(node) => {
              inputRef.current = node;
              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            placeholder={placeholder}
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => showSuggestions && setIsOpen(true)}
            className={cn("pl-10", value && "pr-10")}
            disabled={disabled}
          />
          {value && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {isOpen && showSuggestions && filteredSuggestions.length > 0 && (
          <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-64 overflow-y-auto shadow-lg">
            <CardContent className="p-0">
              {filteredSuggestions.map((suggestion, index) => {
                const Icon = getSuggestionIcon(suggestion.type);
                const isActive = index === focusedIndex;

                return (
                  <div
                    key={suggestion.id}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 cursor-pointer text-sm transition-colors",
                      isActive ? "bg-muted" : "hover:bg-muted/50"
                    )}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    onMouseEnter={() => setFocusedIndex(index)}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Icon className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{suggestion.text}</span>
                      {suggestion.category && (
                        <Badge variant="secondary" className="text-xs">
                          {suggestion.category}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {suggestion.count && (
                        <span className="text-xs text-muted-foreground">
                          {suggestion.count}
                        </span>
                      )}
                      {suggestion.type !== "recent" && (
                        <Badge variant="outline" className="text-xs">
                          {getSuggestionLabel(suggestion.type)}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }
);

SmartSearchInput.displayName = "SmartSearchInput";
