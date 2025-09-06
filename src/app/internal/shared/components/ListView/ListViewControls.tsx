import { Search, RefreshCw, Grid3X3, List, Filter } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { useListViewTheme } from "../../hooks/useListViewTheme";
import { ListViewControlsProps } from "../../types/listView.types";

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
  children
}: ListViewControlsProps) {
  const theme = useListViewTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search & Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={onRefresh}
              disabled={isLoading}
              className={theme.buttonSecondaryClass}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            
            {/* Filters Toggle */}
            {showFilters && onToggleFilters && (
              <Button
                variant="outline"
                onClick={onToggleFilters}
                className={`${theme.buttonSecondaryClass} flex items-center gap-2`}
              >
                <Filter className="h-4 w-4" />
                Filters
                {filtersActive && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    !
                  </Badge>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* View Mode Toggle & Custom Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {children && (
            <div className="flex-1">
              {children}
            </div>
          )}
          
          {/* View Mode Toggle - Bordered Button Group Style */}
          <div className="flex rounded-md border border-input">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={viewMode === 'list' ? onViewModeToggle : undefined}
              className={`rounded-r-none border-r ${
                viewMode === 'grid' 
                  ? theme.buttonPrimaryClass 
                  : `${theme.buttonSecondaryClass} bg-transparent`
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={viewMode === 'grid' ? onViewModeToggle : undefined}
              className={`rounded-l-none ${
                viewMode === 'list' 
                  ? theme.buttonPrimaryClass 
                  : `${theme.buttonSecondaryClass} bg-transparent`
              }`}
            >
              <List className="h-4 w-4" />
              List
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}