import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { X } from "lucide-react";
import { ClinicSearchParams, ClinicStatus, ClinicType } from "../types/clinic.types";

interface ClinicFiltersProps {
  filters: Partial<ClinicSearchParams>;
  onFiltersChange: (filters: Partial<ClinicSearchParams>) => void;
}

export function ClinicFilters({ filters, onFiltersChange }: ClinicFiltersProps) {
  const hasFilters = filters.status || filters.type || filters.city;

  const updateFilter = (key: keyof ClinicSearchParams, value: string | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value === "all" ? undefined : value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Status Filter */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Status:</span>
        <Select
          value={filters.status || "all"}
          onValueChange={(value) => updateFilter("status", value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {Object.values(ClinicStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Type Filter */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Type:</span>
        <Select
          value={filters.type || "all"}
          onValueChange={(value) => updateFilter("type", value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {Object.values(ClinicType).map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* City Filter */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">City:</span>
        <Select
          value={filters.city || "all"}
          onValueChange={(value) => updateFilter("city", value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="London">London</SelectItem>
            <SelectItem value="Manchester">Manchester</SelectItem>
            <SelectItem value="Birmingham">Birmingham</SelectItem>
            <SelectItem value="Leeds">Leeds</SelectItem>
            <SelectItem value="Liverpool">Liverpool</SelectItem>
            <SelectItem value="Sheffield">Sheffield</SelectItem>
            <SelectItem value="Bristol">Bristol</SelectItem>
            <SelectItem value="Cardiff">Cardiff</SelectItem>
            <SelectItem value="Edinburgh">Edinburgh</SelectItem>
            <SelectItem value="Glasgow">Glasgow</SelectItem>
            <SelectItem value="Newcastle">Newcastle</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="flex items-center gap-2"
        >
          <X className="h-3 w-3" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}