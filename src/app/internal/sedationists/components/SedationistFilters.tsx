import { useState } from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Separator } from "@/shared/components/ui/separator";
import { 
  SedationistFilters as FilterType, 
  SedationistStatus, 
  SedationistSpecialty, 
  CertificationStatus 
} from '../types';

interface SedationistFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
}

const statusOptions = [
  { value: SedationistStatus.ACTIVE, label: 'Active' },
  { value: SedationistStatus.INACTIVE, label: 'Inactive' },
  { value: SedationistStatus.ON_LEAVE, label: 'On Leave' },
  { value: SedationistStatus.IN_TRAINING, label: 'In Training' },
];

const specialtyOptions = [
  { value: SedationistSpecialty.GENERAL_ANAESTHESIA, label: 'General Anaesthesia' },
  { value: SedationistSpecialty.CONSCIOUS_SEDATION, label: 'Conscious Sedation' },
  { value: SedationistSpecialty.IV_SEDATION, label: 'IV Sedation' },
  { value: SedationistSpecialty.NITROUS_OXIDE, label: 'Nitrous Oxide' },
  { value: SedationistSpecialty.PEDIATRIC_SEDATION, label: 'Pediatric Sedation' },
  { value: SedationistSpecialty.CARDIAC_SEDATION, label: 'Cardiac Sedation' },
];

const certificationStatusOptions = [
  { value: CertificationStatus.VALID, label: 'Valid' },
  { value: CertificationStatus.EXPIRING_SOON, label: 'Expiring Soon' },
  { value: CertificationStatus.EXPIRED, label: 'Expired' },
  { value: CertificationStatus.PENDING_RENEWAL, label: 'Pending Renewal' },
];

export function SedationistFilters({ filters, onFiltersChange }: SedationistFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onFiltersChange({ ...filters, search: value });
  };

  const handleStatusChange = (status: SedationistStatus, checked: boolean) => {
    const newStatus = checked
      ? [...filters.status, status]
      : filters.status.filter(s => s !== status);
    onFiltersChange({ ...filters, status: newStatus });
  };

  const handleSpecialtyChange = (specialty: SedationistSpecialty, checked: boolean) => {
    const newSpecialties = checked
      ? [...filters.specialties, specialty]
      : filters.specialties.filter(s => s !== specialty);
    onFiltersChange({ ...filters, specialties: newSpecialties });
  };

  const handleCertificationStatusChange = (certStatus: CertificationStatus, checked: boolean) => {
    const newCertStatus = checked
      ? [...filters.certificationStatus, certStatus]
      : filters.certificationStatus.filter(s => s !== certStatus);
    onFiltersChange({ ...filters, certificationStatus: newCertStatus });
  };

  const handleAvailableOnlyChange = (checked: boolean) => {
    onFiltersChange({ ...filters, availableOnly: checked });
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterType = {
      search: '',
      status: [],
      specialties: [],
      certificationStatus: [],
      availableOnly: false,
    };
    setSearchValue('');
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = 
    filters.search || 
    filters.status.length > 0 || 
    filters.specialties.length > 0 || 
    filters.certificationStatus.length > 0 ||
    filters.availableOnly;

  const activeFilterCount = 
    filters.status.length + 
    filters.specialties.length + 
    filters.certificationStatus.length +
    (filters.availableOnly ? 1 : 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or license number..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filters</h4>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>

              <Separator />

              {/* Available Only */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Availability</h5>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="available-only"
                    checked={filters.availableOnly}
                    onCheckedChange={handleAvailableOnlyChange}
                  />
                  <label htmlFor="available-only" className="text-sm">
                    Available only
                  </label>
                </div>
              </div>

              <Separator />

              {/* Status */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Status</h5>
                <div className="space-y-2">
                  {statusOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${option.value}`}
                        checked={filters.status.includes(option.value)}
                        onCheckedChange={(checked) => 
                          handleStatusChange(option.value, checked as boolean)
                        }
                      />
                      <label htmlFor={`status-${option.value}`} className="text-sm">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Specialties */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Specialties</h5>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {specialtyOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`specialty-${option.value}`}
                        checked={filters.specialties.includes(option.value)}
                        onCheckedChange={(checked) => 
                          handleSpecialtyChange(option.value, checked as boolean)
                        }
                      />
                      <label htmlFor={`specialty-${option.value}`} className="text-sm">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Certification Status */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Certification Status</h5>
                <div className="space-y-2">
                  {certificationStatusOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cert-${option.value}`}
                        checked={filters.certificationStatus.includes(option.value)}
                        onCheckedChange={(checked) => 
                          handleCertificationStatusChange(option.value, checked as boolean)
                        }
                      />
                      <label htmlFor={`cert-${option.value}`} className="text-sm">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.availableOnly && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => handleAvailableOnlyChange(false)}>
              Available Only ×
            </Badge>
          )}
          {filters.status.map(status => (
            <Badge key={status} variant="secondary" className="cursor-pointer" onClick={() => handleStatusChange(status, false)}>
              {statusOptions.find(s => s.value === status)?.label} ×
            </Badge>
          ))}
          {filters.specialties.map(specialty => (
            <Badge key={specialty} variant="secondary" className="cursor-pointer" onClick={() => handleSpecialtyChange(specialty, false)}>
              {specialtyOptions.find(s => s.value === specialty)?.label} ×
            </Badge>
          ))}
          {filters.certificationStatus.map(certStatus => (
            <Badge key={certStatus} variant="secondary" className="cursor-pointer" onClick={() => handleCertificationStatusChange(certStatus, false)}>
              {certificationStatusOptions.find(s => s.value === certStatus)?.label} ×
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}