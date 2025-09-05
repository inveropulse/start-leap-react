import React, { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Separator } from "@/shared/components/ui/separator";
import { Badge } from "@/shared/components/ui/badge";
import {
  Search,
  RefreshCw,
  User,
  Mail,
  Phone,
  FileText,
  X,
} from "lucide-react";
import { useCalendarStore } from "@/app/internal/calendar/store/calendarStore";
import { PortalType } from "@/shared/types";
import { SedationistDto } from "@/api/generated/models/SedationistDto";
import { cn } from "@/shared/lib/utils";

interface SedationistSingleSelectProps {
  value?: string;
  onValueChange: (sedationistId: string | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function SedationistSingleSelect({
  value,
  onValueChange,
  placeholder = "Select a sedationist...",
  className,
}: SedationistSingleSelectProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { sedationists, isLoadingSedationists, refreshSedationists } =
    useCalendarStore(PortalType.INTERNAL);

  // Filter sedationists based on search term
  const filteredSedationists = useMemo(() => {
    if (!sedationists) return [];

    if (!searchTerm.trim()) {
      return sedationists;
    }

    const searchLower = searchTerm.toLowerCase();
    return sedationists.filter((sedationist) => {
      const searchFields = [
        sedationist.fullName,
        sedationist.email,
        sedationist.phoneNumber,
        sedationist.notes,
      ];

      return searchFields.some(
        (field) => field && field.toLowerCase().includes(searchLower)
      );
    });
  }, [sedationists, searchTerm]);

  const selectedSedationist = useMemo(() => {
    return sedationists?.find((s) => s.id === value);
  }, [sedationists, value]);

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleRefresh = async () => {
    await refreshSedationists();
  };

  const handleClearSelection = () => {
    onValueChange(undefined);
    setIsOpen(false);
  };

  if (isLoadingSedationists) {
    return (
      <div className={cn("w-full", className)}>
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Loading sedationists..." />
          </SelectTrigger>
        </Select>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <Select
        value={value || ""}
        onValueChange={(val) => onValueChange(val || undefined)}
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder}>
            {selectedSedationist && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{selectedSedationist.fullName}</span>
                {selectedSedationist.email && (
                  <Badge variant="secondary" className="text-xs">
                    {selectedSedationist.email}
                  </Badge>
                )}
              </div>
            )}
          </SelectValue>
        </SelectTrigger>

        <SelectContent className="w-[400px] max-h-[400px]">
          {/* Search and controls */}
          <div className="p-2 space-y-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search sedationists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-8"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearSearch}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoadingSedationists}
              >
                <RefreshCw
                  className={cn(
                    "h-4 w-4",
                    isLoadingSedationists && "animate-spin"
                  )}
                />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {value && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearSelection}
                  className="flex-1"
                >
                  Clear Selection
                </Button>
              )}
            </div>
          </div>

          <Separator />

          {/* Sedationist list */}
          <div className="max-h-[300px] overflow-y-auto">
            {filteredSedationists.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                {searchTerm ? (
                  <div>
                    <p>No sedationists found matching "{searchTerm}"</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearSearch}
                      className="mt-2"
                    >
                      Clear search
                    </Button>
                  </div>
                ) : (
                  <p>No sedationists available</p>
                )}
              </div>
            ) : (
              filteredSedationists.map((sedationist) => (
                <SelectItem key={sedationist.id} value={sedationist.id || ""}>
                  <div className="flex items-center justify-between w-full py-2">
                    <div className="flex items-center gap-3 flex-1">
                      <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">
                          {sedationist.fullName}
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          {sedationist.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <span className="truncate">
                                {sedationist.email}
                              </span>
                            </div>
                          )}
                          {sedationist.phoneNumber && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span>{sedationist.phoneNumber}</span>
                            </div>
                          )}
                          {sedationist.notes && (
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              <span className="truncate max-w-[200px]">
                                {sedationist.notes}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))
            )}
          </div>

          {filteredSedationists.length > 0 && (
            <>
              <Separator />
              <div className="p-2 text-xs text-muted-foreground">
                {filteredSedationists.length} sedationist
                {filteredSedationists.length !== 1 ? "s" : ""} available
                {searchTerm && ` (filtered from ${sedationists?.length || 0})`}
              </div>
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}