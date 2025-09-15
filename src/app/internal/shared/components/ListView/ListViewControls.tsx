import { Search, RefreshCw, Grid, List, Filter } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { TouchButton } from "@/shared/components/ui/TouchButton";
import { Card, CardContent } from "@/shared/components/ui/card";
import { SmartSearchInput } from "@/shared/components/ui/SmartSearchInput";
import { FilterPills, FilterPill } from "@/shared/components/ui/FilterPills";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { useLocalStorage } from "@/shared/hooks/useLocalStorage";
import { ListViewControlsProps } from "@/shared/types/ui/listView.types";
import { useState, useMemo, useEffect } from "react";

export function ListViewControls({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  viewMode,
  onViewModeToggle,
  onRefresh,
  isLoading,
  showFilters,
  filtersActive,
  onToggleFilters,
  showSearchButton = false,
  searchMinLength = 3,
  children,
}: ListViewControlsProps) {
  const isMobile = useIsMobile();
  const ButtonComponent = isMobile ? TouchButton : Button;

  // Simple search state
  const [inputValue, setInputValue] = useState(searchValue);
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>(
    "recent-searches",
    []
  );

  // Sync with prop
  useEffect(() => {
    setInputValue(searchValue);
  }, [searchValue]);

  // Mock search suggestions - in real app, these would come from API
  const searchSuggestions = useMemo(
    () => [
      {
        id: "1",
        text: "Active patients",
        type: "suggestion" as const,
        category: "Status",
        count: 145,
      },
      {
        id: "2",
        text: "Scheduled appointments",
        type: "suggestion" as const,
        category: "Status",
        count: 23,
      },
      {
        id: "3",
        text: "Pending consultations",
        type: "suggestion" as const,
        category: "Type",
        count: 8,
      },
      {
        id: "4",
        text: "Emergency cases",
        type: "trending" as const,
        category: "Priority",
        count: 5,
      },
    ],
    []
  );

  // Mock active filters (simplified)
  const activeFilters: FilterPill[] = useMemo(() => {
    const filters: FilterPill[] = [];
    if (searchValue) {
      filters.push({
        id: "search",
        label: `"${searchValue}"`,
        value: searchValue,
        category: "Search",
        color: "primary",
      });
    }
    return filters;
  }, [searchValue]);

  // 4. Track recent searches
  const addRecentSearch = (search: string) => {
    if (search.trim() && search.length >= searchMinLength) {
      const updated = [
        search,
        ...recentSearches.filter((s) => s !== search),
      ].slice(0, 5);
      setRecentSearches(updated);
    }
  };

  // 1. Handle input change
  const handleInputChange = (value: string) => {
    setInputValue(value);

    if (showSearchButton) {
      if (value === "") {
        onSearchChange(value);
      }

      return;
    }

    // Auto-search: trigger immediately if no button OR if empty (reset)
    if (value === "" || value.length >= searchMinLength) {
      onSearchChange(value);
    }

    // Track recent searches for valid searches
    if (value.trim() && value.length >= searchMinLength) {
      addRecentSearch(value);
    }
  };

  // 2. Handle button click
  const handleButtonClick = () => {
    if (inputValue === "" || inputValue.length >= searchMinLength) {
      onSearchChange(inputValue);
      if (inputValue.trim()) {
        addRecentSearch(inputValue);
      }
    }
  };

  // 3. Handle Enter key
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && showSearchButton) {
      handleButtonClick();
    }
  };

  const handleRemoveFilter = (filterId: string) => {
    if (filterId === "search") {
      setInputValue("");
      onSearchChange("");
    }
  };

  const handleClearAllFilters = () => {
    setInputValue("");
    onSearchChange("");
  };

  // 5. Show validation message
  const showValidation =
    showSearchButton && inputValue && inputValue.length < searchMinLength;

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="flex gap-2">
                  {/* Search Input */}
                  <div className="flex-1">
                    <SmartSearchInput
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder={searchPlaceholder}
                      suggestions={searchSuggestions}
                      recentSearches={recentSearches}
                      onRecentSearch={addRecentSearch}
                      fuzzySearch={true}
                    />
                  </div>

                  {/* Search Button (external) */}
                  {showSearchButton && (
                    <ButtonComponent
                      variant="outline"
                      size="sm"
                      onClick={handleButtonClick}
                      disabled={isLoading}
                      className="px-3 shrink-0"
                    >
                      <Search className="h-4 w-4" />
                    </ButtonComponent>
                  )}
                </div>

                {/* Validation Message */}
                {showValidation && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Enter at least {searchMinLength} characters to search
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <div className="flex border rounded-md">
                  <ButtonComponent
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => viewMode !== "grid" && onViewModeToggle()}
                    disabled={isLoading}
                    className="rounded-r-none border-r-0"
                  >
                    <Grid className="h-4 w-4" />
                  </ButtonComponent>
                  <ButtonComponent
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => viewMode !== "list" && onViewModeToggle()}
                    disabled={isLoading}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </ButtonComponent>
                </div>

                {showFilters && onToggleFilters && (
                  <ButtonComponent
                    variant="outline"
                    size="sm"
                    onClick={onToggleFilters}
                    disabled={isLoading}
                    className={`flex items-center gap-2 ${
                      filtersActive
                        ? "bg-portal-internal-primary/10 text-portal-internal-primary border-portal-internal-primary/30"
                        : ""
                    }`}
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                    {filtersActive && (
                      <span className="bg-portal-internal-primary text-white rounded-full px-1.5 py-0.5 text-xs min-w-[1rem] h-4 flex items-center justify-center text-[10px]">
                        {typeof filtersActive === "number"
                          ? filtersActive
                          : "•"}
                      </span>
                    )}
                  </ButtonComponent>
                )}

                {/* Refresh Button */}
                <ButtonComponent
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  disabled={isLoading}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                </ButtonComponent>
              </div>
            </div>

            {/* Filter Pills */}
            {activeFilters.length > 0 && (
              <FilterPills
                filters={activeFilters}
                onRemoveFilter={handleRemoveFilter}
                onClearAll={handleClearAllFilters}
                className="animate-fade-in"
              />
            )}

            {/* Custom Filters */}
            {children && <div className="pt-4 border-t">{children}</div>}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
