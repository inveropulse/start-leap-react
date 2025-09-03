import { useState, useEffect } from "react";
import { Check, ChevronDown, Search, Users, X, RefreshCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectTrigger,
} from "@/shared/components/ui/select";
import { useCalendarStore } from "../store/calendarStore";
import { PortalType } from "@/shared/types";
import { cn } from "@/shared/utils/cn";

export function SedationistMultiSelect() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const {
    sedationists,
    selectedSedationistIds,
    setSelectedSedationists,
    isLoadingSedationists,
    refreshSedationists,
  } = useCalendarStore(PortalType.INTERNAL);

  const filteredSedationists = sedationists?.filter(sedationist => {
    const searchLower = searchTerm.toLowerCase();
    
    // Search through multiple fields
    const searchableFields = [
      `${sedationist.firstName} ${sedationist.lastName}`,
      sedationist.firstName,
      sedationist.lastName,
      sedationist.email,
      sedationist.phoneNumber,
      sedationist.notes
    ].filter(Boolean);
    
    return searchableFields.some(field => 
      field?.toLowerCase().includes(searchLower)
    );
  }) || [];

  // Debug logging
  useEffect(() => {
    if (searchTerm) {
      console.log('Search term:', searchTerm);
      console.log('Total sedationists:', sedationists?.length || 0);
      console.log('Filtered results:', filteredSedationists.length);
      console.log('Filtered sedationists:', filteredSedationists.map(s => ({
        name: `${s.firstName} ${s.lastName}`,
        email: s.email,
        notes: s.notes
      })));
    }
  }, [searchTerm, filteredSedationists, sedationists]);

  const handleSedationistToggle = (sedationistId: string) => {
    const newSelection = selectedSedationistIds.includes(sedationistId)
      ? selectedSedationistIds.filter(id => id !== sedationistId)
      : [...selectedSedationistIds, sedationistId];
    
    setSelectedSedationists(newSelection);
  };

  const selectAll = () => {
    const allIds = filteredSedationists.map(s => s.id).filter(Boolean);
    setSelectedSedationists(allIds);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleRefresh = async () => {
    await refreshSedationists();
  };

  const selectNone = () => {
    setSelectedSedationists([]);
  };

  const getSelectedNames = () => {
    if (selectedSedationistIds.length === 0) return "Select sedationists";
    if (selectedSedationistIds.length === 1) {
      const sedationist = sedationists?.find(s => s.id === selectedSedationistIds[0]);
      return sedationist ? `${sedationist.firstName} ${sedationist.lastName}` : "1 selected";
    }
    return `${selectedSedationistIds.length} sedationists selected`;
  };

  if (isLoadingSedationists) {
    return (
      <div className="w-[280px]">
        <Button variant="outline" disabled className="w-full justify-between">
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Loading...
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-[280px]">
      <Select open={isOpen} onOpenChange={setIsOpen}>
        <SelectTrigger className="w-full h-10">
          <div className="flex items-center gap-2 flex-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className={cn(
              "truncate",
              selectedSedationistIds.length === 0 && "text-muted-foreground"
            )}>
              {getSelectedNames()}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </SelectTrigger>

        <SelectContent 
          className="w-[280px] p-0 bg-popover border border-border shadow-lg"
          align="start"
          side="bottom"
          sideOffset={4}
        >
          <div className="p-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>
                  {searchTerm 
                    ? `${filteredSedationists.length} of ${sedationists?.length || 0}` 
                    : `${sedationists?.length || 0} total`
                  }
                </span>
              </div>
              <Button
                variant="ghost" 
                size="sm"
                onClick={handleRefresh}
                disabled={isLoadingSedationists}
                className="h-6 w-6 p-0 ml-auto"
                title="Refresh sedationists"
              >
                <RefreshCw className={cn("h-3 w-3", isLoadingSedationists && "animate-spin")} />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, phone, or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-8 h-8"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  title="Clear search"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          <div className="p-2 border-b border-border bg-muted/20">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={selectAll}
                className="flex-1 h-7 text-xs"
                disabled={filteredSedationists.length === 0}
              >
                Select All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={selectNone}
                className="flex-1 h-7 text-xs"
                disabled={selectedSedationistIds.length === 0}
              >
                Clear All
              </Button>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {filteredSedationists.length > 0 ? (
              <div className="p-1">
                {filteredSedationists.map((sedationist) => {
                  const isSelected = selectedSedationistIds.includes(sedationist.id);
                  
                  return (
                    <div
                      key={sedationist.id}
                      className="flex items-center gap-3 p-2 rounded-sm hover:bg-accent/50 cursor-pointer group"
                      onClick={() => handleSedationistToggle(sedationist.id)}
                    >
                      <Checkbox
                        checked={isSelected}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {sedationist.firstName} {sedationist.lastName}
                        </p>
                        {sedationist.email && (
                          <p className="text-xs text-muted-foreground truncate">
                            {sedationist.email}
                          </p>
                        )}
                        {sedationist.notes && (
                          <p className="text-xs text-muted-foreground truncate mt-0.5 opacity-75">
                            {sedationist.notes}
                          </p>
                        )}
                      </div>

                      {isSelected && (
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {searchTerm ? `No sedationists match "${searchTerm}"` : 'No sedationists available'}
                </p>
                {searchTerm && (
                  <p className="text-xs mt-1 opacity-75">
                    Try searching by name, email, phone, or specialization
                  </p>
                )}
              </div>
            )}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}