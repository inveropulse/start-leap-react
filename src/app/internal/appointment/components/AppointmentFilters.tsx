import { useState } from 'react';
import { Search, Calendar, Filter, X } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { FormDateField } from '@/shared/components/form';
import { useForm } from 'react-hook-form';
import { AppointmentStatus, AppointmentFilters as AppointmentFiltersType } from '../types';

interface AppointmentFiltersProps {
  filters: AppointmentFiltersType;
  onFiltersChange: (filters: AppointmentFiltersType) => void;
  totalResults: number;
}

interface DateRangeForm {
  dateFrom: string;
  dateTo: string;
}

export function AppointmentFilters({ filters, onFiltersChange, totalResults }: AppointmentFiltersProps) {
  // Component for filtering appointments
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  
  const { control, watch, setValue } = useForm<DateRangeForm>({
    defaultValues: {
      dateFrom: filters.dateFrom || '',
      dateTo: filters.dateTo || '',
    },
  });

  const dateFrom = watch('dateFrom');
  const dateTo = watch('dateTo');

  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search });
  };

  const handleStatusChange = (status: string) => {
    if (status === 'all') {
      onFiltersChange({ ...filters, status: [] });
    } else {
      const statusEnum = status as AppointmentStatus;
      const newStatus = filters.status.includes(statusEnum)
        ? filters.status.filter(s => s !== statusEnum)
        : [...filters.status, statusEnum];
      onFiltersChange({ ...filters, status: newStatus });
    }
  };

  const applyDateRange = () => {
    onFiltersChange({
      ...filters,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    });
    setIsDateRangeOpen(false);
  };

  const clearDateRange = () => {
    setValue('dateFrom', '');
    setValue('dateTo', '');
    onFiltersChange({
      ...filters,
      dateFrom: undefined,
      dateTo: undefined,
    });
    setIsDateRangeOpen(false);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      status: [],
      dateFrom: undefined,
      dateTo: undefined,
    });
    setValue('dateFrom', '');
    setValue('dateTo', '');
  };

  const activeFiltersCount = 
    (filters.search ? 1 : 0) + 
    filters.status.length + 
    (filters.dateFrom || filters.dateTo ? 1 : 0);

  const getStatusLabel = (status: AppointmentStatus): string => {
    switch (status) {
      case AppointmentStatus.SCHEDULED: return 'Scheduled';
      case AppointmentStatus.CONFIRMED: return 'Confirmed';
      case AppointmentStatus.IN_PROGRESS: return 'In Progress';
      case AppointmentStatus.COMPLETED: return 'Completed';
      case AppointmentStatus.CANCELLED: return 'Cancelled';
      case AppointmentStatus.NO_SHOW: return 'No Show';
      case AppointmentStatus.RESCHEDULED: return 'Rescheduled';
      default: return status;
    }
  };

  const quickFilters = [
    { label: "Today's Appointments", onClick: () => {
      const today = new Date().toISOString().split('T')[0];
      onFiltersChange({ ...filters, dateFrom: today, dateTo: today });
    }},
    { label: "This Week", onClick: () => {
      const today = new Date();
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
      const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
      onFiltersChange({ 
        ...filters, 
        dateFrom: weekStart.toISOString().split('T')[0],
        dateTo: weekEnd.toISOString().split('T')[0]
      });
    }},
    { label: "Pending Confirmation", onClick: () => {
      onFiltersChange({ ...filters, status: [AppointmentStatus.SCHEDULED] });
    }},
  ];

  return (
    <div className="space-y-4">
      {/* Search and Main Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by patient name, reference, or procedure..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <Select onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.values(AppointmentStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {getStatusLabel(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Range Filter */}
        <Popover open={isDateRangeOpen} onOpenChange={setIsDateRangeOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full lg:w-48">
              <Calendar className="h-4 w-4 mr-2" />
              Date Range
              {(filters.dateFrom || filters.dateTo) && (
                <Badge variant="secondary" className="ml-2">1</Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="font-medium">Select Date Range</div>
              <div className="space-y-3">
                <FormDateField
                  control={control}
                  name="dateFrom"
                  label="From Date"
                />
                <FormDateField
                  control={control}
                  name="dateTo"
                  label="To Date"
                />
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={clearDateRange} size="sm">
                  Clear
                </Button>
                <Button onClick={applyDateRange} size="sm">
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Filter Summary */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full lg:w-auto"
          onClick={clearAllFilters}
        >
          <Filter className="h-4 w-4 mr-2" />
          {activeFiltersCount > 0 ? (
            <>Clear Filters ({activeFiltersCount})</>
          ) : (
            'Filters'
          )}
        </Button>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {quickFilters.map((filter, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={filter.onClick}
            className="text-xs"
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {filters.search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: "{filters.search}"
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleSearchChange('')}
              />
            </Badge>
          )}
          
          {filters.status.map((status) => (
            <Badge key={status} variant="secondary" className="flex items-center gap-1">
              {getStatusLabel(status)}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleStatusChange(status)}
              />
            </Badge>
          ))}
          
          {(filters.dateFrom || filters.dateTo) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.dateFrom && filters.dateTo
                ? `${filters.dateFrom} to ${filters.dateTo}`
                : filters.dateFrom
                ? `From ${filters.dateFrom}`
                : `To ${filters.dateTo}`}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={clearDateRange}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        Showing {totalResults} appointment{totalResults !== 1 ? 's' : ''}
        {activeFiltersCount > 0 && ' (filtered)'}
      </div>
    </div>
  );
}