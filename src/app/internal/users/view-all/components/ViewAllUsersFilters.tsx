import { Search, Grid, List, RefreshCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useState } from "react";

export interface ViewAllUsersFiltersProps {
  // Search props
  searchQuery: string;
  onSearchChange: (query: string) => void; // ✅ Single callback for search execution
  autoSearch?: boolean; // ✅ Determines search behavior

  // View controls props
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  viewMode: "table" | "grid";
  onViewModeChange: (mode: "table" | "grid") => void;

  // Refresh props
  onRefresh: () => void;
  isRefreshing: boolean;

  // Loading state
  isLoading: boolean;
}

/**
 * Filters and Controls component for ViewAllUsers
 * Supports both auto-search and manual search modes
 * Follows Single Responsibility Principle - focused on user input controls
 */
export default function ViewAllUsersFilters({
  searchQuery,
  onSearchChange,
  autoSearch = true, // ✅ Default to auto-search for backward compatibility
  pageSize,
  onPageSizeChange,
  viewMode,
  onViewModeChange,
  onRefresh,
  isRefreshing,
  isLoading,
}: ViewAllUsersFiltersProps) {
  const [searchText, setSearchText] = useState(searchQuery || "");

  // Handle input changes - auto-search or store locally
  const handleInputChange = (value: string) => {
    setSearchText(value);
    if (value == "") {
      onSearchChange(value);
      return;
    }

    // Auto-search mode: execute search immediately
    if (autoSearch) {
      if (value == "" || value.length > 2) {
        onSearchChange(value);
      }
    }
  };

  // Handle search form submission (manual search mode only)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Manual search mode: execute search on form submit
    if (!autoSearch) {
      if (searchText == "" || searchText.length > 2) {
        onSearchChange(searchText);
      }
    }
  };

  const handleClearSearch = () => {
    setSearchText("");
    onSearchChange("");
  };

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-4 flex-1">
        {/* Search Form */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center gap-2 w-full"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchText}
              onChange={(e) => handleInputChange(e.target.value)}
              className="pl-10 pr-4 w-full"
            />
          </div>

          {/* Search Button - Only show in manual search mode */}
          {!autoSearch && (
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="flex items-center gap-1 px-3"
              disabled={isLoading}
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          )}
        </form>

        <Button variant="ghost" size="sm" onClick={handleClearSearch}>
          Clear
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {/* Page size selector */}
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(parseInt(value))}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>

        {/* Refresh Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1"
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          <span className="sr-only">Refresh</span>
        </Button>

        {/* View mode toggle */}
        <div className="flex border rounded-md">
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("table")}
            className="rounded-r-none"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
            className="rounded-l-none"
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
