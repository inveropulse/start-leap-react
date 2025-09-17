import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Badge } from "@/shared/components/ui/badge";
import { X, Search, Filter } from "lucide-react";
import {
  SedationistStatus,
  SedationistSpecialty,
  CertificationStatus,
  SedationistFilters as FilterType,
} from "@/shared/types/domains/sedationist";
import { sedationistUtils } from "../../shared";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { TouchButton } from "@/shared/components/ui";

export interface SedationistFiltersProps {
  filters: FilterType;
  isLoading?: boolean;
  showSearchButton?: boolean;
  onFiltersChange: (filters: FilterType) => void;
}

export default function SedationistFilters({
  filters,
  isLoading,
  showSearchButton,
  onFiltersChange,
}: SedationistFiltersProps) {
  const isMobile = useIsMobile();
  const ButtonComponent = isMobile ? TouchButton : Button;
  const [localSearch, setLocalSearch] = useState(filters.search || "");

  // Handle search input changes with debouncing logic
  const handleSearchChange = (value: string) => {
    setLocalSearch(value);

    if (showSearchButton) {
      if (value === "") {
        onFiltersChange({
          ...filters,
          search: value,
        });
      }
      return;
    }

    if (value !== "" && value.length < 3) return;

    // Debounce search updates
    setTimeout(() => {
      onFiltersChange({
        ...filters,
        search: value,
      });
    }, 300);
  };

  const handleSearchButtonClick = () => {
    if (localSearch !== "" && localSearch.length < 3) return;

    // Debounce search updates
    setTimeout(() => {
      onFiltersChange({
        ...filters,
        search: localSearch,
      });
    }, 300);
  };

  const handleStatusFilter = (status: SedationistStatus | "all") => {
    const newStatus = status === "all" ? [] : [status as SedationistStatus];
    onFiltersChange({
      ...filters,
      status: newStatus,
    });
  };

  const handleSpecialtyFilter = (specialty: SedationistSpecialty | "all") => {
    if (specialty === "all") {
      onFiltersChange({
        ...filters,
        specialty: [],
      });
      return;
    }

    const currentSpecialties = filters.specialty || [];
    const updatedSpecialties = currentSpecialties.includes(
      specialty as SedationistSpecialty
    )
      ? currentSpecialties.filter((s) => s !== specialty)
      : [...currentSpecialties, specialty as SedationistSpecialty];

    onFiltersChange({
      ...filters,
      specialty: updatedSpecialties,
    });
  };

  const handleCertificationStatusFilter = (
    certStatus: CertificationStatus | "all"
  ) => {
    if (certStatus === "all") {
      onFiltersChange({
        ...filters,
        certificationStatus: [],
      });
      return;
    }

    const currentStatuses = filters.certificationStatus || [];
    const updatedStatuses = currentStatuses.includes(
      certStatus as CertificationStatus
    )
      ? currentStatuses.filter((s) => s !== certStatus)
      : [...currentStatuses, certStatus as CertificationStatus];

    onFiltersChange({
      ...filters,
      certificationStatus: updatedStatuses,
    });
  };

  const handleToggleAvailableToday = () => {
    onFiltersChange({
      ...filters,
      availableToday: !filters.availableToday,
    });
  };

  const handleToggleShowInactive = () => {
    onFiltersChange({
      ...filters,
      showInactive: !filters.showInactive,
    });
  };

  const clearAllFilters = () => {
    setLocalSearch("");
    onFiltersChange({
      search: "",
      status: [],
      specialty: [],
      location: "",
      certificationStatus: [],
      availableToday: false,
      showInactive: false,
    });
  };

  const hasActiveFilters =
    localSearch ||
    (filters.status && filters.status.length > 0) ||
    (filters.specialty && filters.specialty.length > 0) ||
    (filters.certificationStatus && filters.certificationStatus.length > 0) ||
    filters.availableToday ||
    filters.showInactive;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center w-full gap-2">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search sedationists by name, license, or email..."
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        {showSearchButton && (
          <ButtonComponent
            variant="outline"
            size="sm"
            onClick={handleSearchButtonClick}
            disabled={isLoading}
            className="px-3 shrink-0"
          >
            <Search className="h-4 w-4" />
          </ButtonComponent>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4">
        {/* Status Filter */}
        <div className="space-y-1">
          <Select
            value={
              filters.status && filters.status.length > 0
                ? filters.status[0]
                : "all"
            }
            onValueChange={handleStatusFilter}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {(Object.values(SedationistStatus) as SedationistStatus[]).map(
                (status) => {
                  const config = sedationistUtils.getStatusConfig(status);
                  return (
                    <SelectItem key={status} value={status}>
                      {config.label}
                    </SelectItem>
                  );
                }
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Certification Status Filter */}
        <div className="space-y-1">
          <Select onValueChange={handleCertificationStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Certifications" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Certifications</SelectItem>
              {(
                Object.values(CertificationStatus) as CertificationStatus[]
              ).map((status) => {
                const config =
                  sedationistUtils.getCertificationStatusConfig(status);
                return (
                  <SelectItem key={status} value={status}>
                    {config.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Toggle Buttons */}
        <div className="flex gap-2 items-end">
          <Button
            variant={filters.availableToday ? "default" : "outline"}
            size="sm"
            onClick={handleToggleAvailableToday}
          >
            Available Today
          </Button>

          <Button
            variant={filters.showInactive ? "default" : "outline"}
            size="sm"
            onClick={handleToggleShowInactive}
          >
            Show Inactive
          </Button>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="flex items-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.specialty &&
            filters.specialty.map((specialty) => (
              <Badge key={specialty} variant="secondary" className="gap-1">
                {sedationistUtils.getSpecialtyLabel(specialty)}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1"
                  onClick={() => handleSpecialtyFilter(specialty)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}

          {filters.certificationStatus &&
            filters.certificationStatus.map((status) => (
              <Badge key={status} variant="secondary" className="gap-1">
                {sedationistUtils.getCertificationStatusConfig(status).label}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1"
                  onClick={() => handleCertificationStatusFilter(status)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
        </div>
      )}
    </div>
  );
}
