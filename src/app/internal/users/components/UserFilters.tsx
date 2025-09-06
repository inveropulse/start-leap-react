import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { X } from "lucide-react";
import { type UserFilters, UserStatus, Department, PermissionLevel } from "../types";
import { UserRole } from "@/shared/types";

interface UserFiltersProps {
  filters: UserFilters;
  onFiltersChange: (filters: Partial<UserFilters>) => void;
  onClearFilters: () => void;
}

const statusOptions = [
  { value: UserStatus.ACTIVE, label: "Active" },
  { value: UserStatus.INACTIVE, label: "Inactive" },
  { value: UserStatus.SUSPENDED, label: "Suspended" },
  { value: UserStatus.PENDING_ACTIVATION, label: "Pending Activation" },
];

const roleOptions = [
  { value: UserRole.ADMIN, label: "Administrator" },
  { value: UserRole.BOOKING_COORDINATOR, label: "Booking Coordinator" },
];

const departmentOptions = [
  { value: Department.ADMINISTRATION, label: "Administration" },
  { value: Department.BOOKING, label: "Booking" },
  { value: Department.OPERATIONS, label: "Operations" },
  { value: Department.IT, label: "IT" },
  { value: Department.MANAGEMENT, label: "Management" },
];

const permissionLevelOptions = [
  { value: PermissionLevel.FULL_ACCESS, label: "Full Access" },
  { value: PermissionLevel.LIMITED_ACCESS, label: "Limited Access" },
  { value: PermissionLevel.READ_ONLY, label: "Read Only" },
  { value: PermissionLevel.CUSTOM, label: "Custom" },
];

// Simple multi-select fallback component
function SimpleMultiSelect({ 
  options, 
  value, 
  onValueChange, 
  placeholder 
}: {
  options: { value: string; label: string }[];
  value: string[];
  onValueChange: (values: string[]) => void;
  placeholder: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {value.map((val) => {
          const option = options.find(opt => opt.value === val);
          return option ? (
            <div key={val} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm">
              {option.label}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onValueChange(value.filter(v => v !== val))}
                className="h-auto p-0 w-4 h-4"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : null;
        })}
      </div>
      <select
        className="w-full p-2 border border-input bg-background rounded-md"
        value=""
        onChange={(e) => {
          if (e.target.value && !value.includes(e.target.value)) {
            onValueChange([...value, e.target.value]);
          }
        }}
      >
        <option value="">{placeholder}</option>
        {options.filter(opt => !value.includes(opt.value)).map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function UserFilters({ filters, onFiltersChange, onClearFilters }: UserFiltersProps) {
  return (
    <div className="border-t pt-4 space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Filters</h4>
        <Button variant="outline" size="sm" onClick={onClearFilters}>
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>Status</Label>
          <SimpleMultiSelect
            options={statusOptions}
            value={filters.status}
            onValueChange={(status) => onFiltersChange({ status: status as UserStatus[] })}
            placeholder="Select statuses"
          />
        </div>

        <div className="space-y-2">
          <Label>Roles</Label>
          <SimpleMultiSelect
            options={roleOptions}
            value={filters.roles}
            onValueChange={(roles) => onFiltersChange({ roles: roles as string[] })}
            placeholder="Select roles"
          />
        </div>

        <div className="space-y-2">
          <Label>Departments</Label>
          <SimpleMultiSelect
            options={departmentOptions}
            value={filters.departments}
            onValueChange={(departments) => onFiltersChange({ departments: departments as Department[] })}
            placeholder="Select departments"
          />
        </div>

        <div className="space-y-2">
          <Label>Permission Levels</Label>
          <SimpleMultiSelect
            options={permissionLevelOptions}
            value={filters.permissionLevels}
            onValueChange={(permissionLevels) => onFiltersChange({ permissionLevels: permissionLevels as PermissionLevel[] })}
            placeholder="Select levels"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Last Login After</Label>
          <Input
            type="date"
            value={filters.lastLoginAfter}
            onChange={(e) => onFiltersChange({ lastLoginAfter: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}