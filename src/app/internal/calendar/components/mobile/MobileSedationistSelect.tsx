import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/shared/components/ui/sheet";
import { Users, Search, Check, X } from "lucide-react";
import { useCalendarStore } from "../../store/calendarStore";
import { PortalType } from "@/shared/types";
import { cn } from "@/shared/utils/cn";

export function MobileSedationistSelect() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    sedationists,
    selectedSedationistIds,
    setSelectedSedationists,
    isLoadingSedationists,
  } = useCalendarStore(PortalType.INTERNAL);

  const filteredSedationists = sedationists?.filter((sedationist) => {
    const searchLower = searchTerm.toLowerCase();
    const searchableFields = [
      `${sedationist.firstName} ${sedationist.lastName}`,
      sedationist.firstName,
      sedationist.lastName,
      sedationist.email,
    ].filter(Boolean);

    return searchableFields.some((field) =>
      field?.toLowerCase().includes(searchLower)
    );
  }) || [];

  const handleSedationistToggle = (sedationistId: string) => {
    const newSelection = selectedSedationistIds.includes(sedationistId)
      ? selectedSedationistIds.filter((id) => id !== sedationistId)
      : [...selectedSedationistIds, sedationistId];

    setSelectedSedationists(newSelection);
  };

  const selectAll = () => {
    const allIds = filteredSedationists.map((s) => s.id).filter(Boolean);
    setSelectedSedationists(allIds);
  };

  const selectNone = () => {
    setSelectedSedationists([]);
  };

  const getButtonText = () => {
    if (selectedSedationistIds.length === 0) {
      return "Select Sedationists";
    }
    if (selectedSedationistIds.length === 1) {
      const sedationist = sedationists?.find(s => s.id === selectedSedationistIds[0]);
      return sedationist ? `${sedationist.firstName} ${sedationist.lastName}` : "1 selected";
    }
    return `${selectedSedationistIds.length} selected`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between h-12"
          disabled={isLoadingSedationists}
        >
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className={cn(
              "font-medium",
              selectedSedationistIds.length === 0 && "text-muted-foreground"
            )}>
              {isLoadingSedationists ? "Loading..." : getButtonText()}
            </span>
          </div>
          {selectedSedationistIds.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                {selectedSedationistIds.length}
              </span>
            </div>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="bottom" className="h-[80vh] flex flex-col">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Select Sedationists
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 flex-1 min-h-0">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sedationists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-12"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchTerm("")}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={selectAll}
              disabled={filteredSedationists.length === 0}
              className="flex-1"
            >
              Select All ({filteredSedationists.length})
            </Button>
            <Button
              variant="outline"
              onClick={selectNone}
              disabled={selectedSedationistIds.length === 0}
              className="flex-1"
            >
              Clear All
            </Button>
          </div>

          {/* Sedationist list */}
          <div className="flex-1 overflow-y-auto -mx-2">
            <div className="space-y-1 px-2">
              {filteredSedationists.map((sedationist) => {
                const isSelected = selectedSedationistIds.includes(sedationist.id);
                
                return (
                  <div
                    key={sedationist.id}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer active:scale-95 transition-all"
                    onClick={() => handleSedationistToggle(sedationist.id)}
                  >
                    <Checkbox
                      checked={isSelected}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary pointer-events-none"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">
                        {sedationist.firstName} {sedationist.lastName}
                      </p>
                      {sedationist.email && (
                        <p className="text-sm text-muted-foreground truncate">
                          {sedationist.email}
                        </p>
                      )}
                    </div>
                    
                    {isSelected && (
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    )}
                  </div>
                );
              })}
              
              {filteredSedationists.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>{searchTerm ? `No matches for "${searchTerm}"` : "No sedationists available"}</p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom actions */}
          <div className="border-t pt-4">
            <Button
              onClick={() => setIsOpen(false)}
              className="w-full h-12"
              disabled={selectedSedationistIds.length === 0}
            >
              Done ({selectedSedationistIds.length} selected)
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}