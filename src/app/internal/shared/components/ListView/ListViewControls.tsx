import { Search, RefreshCw, Grid, List, Filter, Settings, Bookmark } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { TouchButton } from "@/shared/components/ui/TouchButton";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { SmartSearchInput } from "@/shared/components/ui/SmartSearchInput";
import { FilterPills, FilterPill } from "@/shared/components/ui/FilterPills";
import { AdvancedFilterPanel, FilterSection } from "@/shared/components/ui/AdvancedFilterPanel";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { useLocalStorage } from "@/shared/hooks/useLocalStorage";
import { useListViewTheme } from "../../hooks/useListViewTheme";
import { ListViewControlsProps } from "@/shared/types/ui/listView.types";
import { useState, useMemo } from "react";

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
  const isMobile = useIsMobile();
  const ButtonComponent = isMobile ? TouchButton : Button;
  
  // Enhanced search and filter state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>('recent-searches', []);
  const [filterPresets, setFilterPresets] = useLocalStorage('filter-presets', []);
  
  // Mock search suggestions - in real app, these would come from API
  const searchSuggestions = useMemo(() => [
    { id: '1', text: 'Active patients', type: 'suggestion' as const, category: 'Status', count: 145 },
    { id: '2', text: 'Scheduled appointments', type: 'suggestion' as const, category: 'Status', count: 23 },
    { id: '3', text: 'Pending consultations', type: 'suggestion' as const, category: 'Type', count: 8 },
    { id: '4', text: 'Emergency cases', type: 'trending' as const, category: 'Priority', count: 5 },
  ], []);

  // Mock active filters - in real app, this would come from props
  const activeFilters: FilterPill[] = useMemo(() => {
    const filters: FilterPill[] = [];
    
    if (searchValue) {
      filters.push({
        id: 'search',
        label: `"${searchValue}"`,
        value: searchValue,
        category: 'Search',
        color: 'primary',
      });
    }
    
    // Add other mock filters based on filtersActive
    if (typeof filtersActive === 'number' && filtersActive > 0) {
      for (let i = 0; i < Math.min(filtersActive, 3); i++) {
        filters.push({
          id: `filter-${i}`,
          label: ['Status: Active', 'Type: Consultation', 'Date: This week'][i] || `Filter ${i + 1}`,
          value: true,
          color: ['success', 'primary', 'secondary'][i] as FilterPill['color'],
        });
      }
    }
    
    return filters;
  }, [searchValue, filtersActive]);

  const handleRecentSearch = (search: string) => {
    const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5);
    setRecentSearches(updated);
  };

  const handleSearchChange = (value: string) => {
    onSearchChange(value);
    if (value.trim()) {
      handleRecentSearch(value);
    }
  };

  const handleRemoveFilter = (filterId: string) => {
    if (filterId === 'search') {
      onSearchChange('');
    }
    // Handle other filter removal logic here
  };

  const handleClearAllFilters = () => {
    onSearchChange('');
    // Clear other filters
  };

  // Mock filter sections for advanced panel
  const filterSections: FilterSection[] = [
    {
      id: 'status',
      title: 'Status & Type',
      children: (
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">Filter by status, type, or priority</div>
          {/* Filter controls would go here */}
        </div>
      ),
    },
    {
      id: 'dates',
      title: 'Date Range',
      children: (
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">Filter by date range</div>
          {/* Date range picker would go here */}
        </div>
      ),
    },
  ];

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Enhanced Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <SmartSearchInput
                  value={searchValue}
                  onChange={handleSearchChange}
                  placeholder={searchPlaceholder}
                  suggestions={searchSuggestions}
                  recentSearches={recentSearches}
                  onRecentSearch={handleRecentSearch}
                  fuzzySearch={true}
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <div className="flex border rounded-md">
                  <ButtonComponent
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => viewMode !== 'grid' && onViewModeToggle()}
                    disabled={isLoading}
                    className="rounded-r-none border-r-0"
                  >
                    <Grid className="h-4 w-4" />
                  </ButtonComponent>
                  <ButtonComponent
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => viewMode !== 'list' && onViewModeToggle()}
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
                    className={`flex items-center gap-2 ${filtersActive ? 'bg-portal-internal-primary/10 text-portal-internal-primary border-portal-internal-primary/30' : ''}`}
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                    {filtersActive && (
                      <span className="bg-portal-internal-primary text-white rounded-full px-1.5 py-0.5 text-xs min-w-[1rem] h-4 flex items-center justify-center text-[10px]">
                        {typeof filtersActive === 'number' ? filtersActive : '•'}
                      </span>
                    )}
                  </ButtonComponent>
                )}
                
                <ButtonComponent
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvancedFilters(true)}
                  disabled={isLoading}
                >
                  <Settings className="h-4 w-4" />
                </ButtonComponent>
                
                <ButtonComponent
                  variant="outline"
                  size="sm" 
                  onClick={onRefresh}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
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
            {children && (
              <div className="pt-4 border-t">
                {children}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filter Panel */}
      <AdvancedFilterPanel
        isOpen={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        sections={filterSections}
        presets={filterPresets}
        onSavePreset={(name, filters) => {
          const newPreset = { id: Date.now().toString(), name, filters };
          setFilterPresets([...filterPresets, newPreset]);
        }}
        onLoadPreset={(preset) => {
          // Load preset logic here
          console.log('Loading preset:', preset);
        }}
        onDeletePreset={(presetId) => {
          setFilterPresets(filterPresets.filter(p => p.id !== presetId));
        }}
      />
    </>
  );
}