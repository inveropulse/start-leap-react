import { Search, RefreshCw, Grid, List, Filter } from "lucide-react";
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
      <CardContent className="p-6">
        <div className="space-y-4">
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
            <div className="flex items-center gap-2">
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => viewMode !== 'grid' && onViewModeToggle()}
                  disabled={isLoading}
                  className="rounded-r-none border-r-0"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => viewMode !== 'list' && onViewModeToggle()}
                  disabled={isLoading}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              
              {showFilters && onToggleFilters && (
                <Button
                  variant="outline" 
                  size="sm"
                  onClick={onToggleFilters}
                  disabled={isLoading}
                  className={`flex items-center gap-2 ${filtersActive ? 'bg-portal-internal-primary/10 text-portal-internal-primary border-portal-internal-primary/30' : ''}`}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {filtersActive && (
                    <span className="bg-portal-internal-primary text-white rounded-full px-1.5 py-0.5 text-xs min-w-[1rem] h-4 flex items-center justify-center text-[10px]">
                      {typeof filtersActive === 'number' ? filtersActive : '•'}
                    </span>
                  )}
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm" 
                onClick={onRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Custom Filters */}
          {children && (
            <div className="pt-4 border-t">
              {children}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}