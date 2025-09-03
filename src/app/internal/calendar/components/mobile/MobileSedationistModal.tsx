import { useState } from "react";
import { X, Search, Users } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { useCalendarStore } from "../../store/calendarStore";
import { PortalType } from "@/shared/types";

interface MobileSedationistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSedationistModal({ isOpen, onClose }: MobileSedationistModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const {
    sedationists,
    selectedSedationistIds,
    setSelectedSedationists,
  } = useCalendarStore(PortalType.INTERNAL);

  const filteredSedationists = sedationists?.filter((sedationist) => {
    const searchLower = searchTerm.toLowerCase();
    const name = `${sedationist.firstName} ${sedationist.lastName}`.toLowerCase();
    const email = sedationist.email?.toLowerCase() || "";
    return name.includes(searchLower) || email.includes(searchLower);
  }) || [];

  const handleSedationistToggle = (sedationistId: string) => {
    const newSelection = selectedSedationistIds.includes(sedationistId)
      ? selectedSedationistIds.filter((id) => id !== sedationistId)
      : [...selectedSedationistIds, sedationistId];
    setSelectedSedationists(newSelection);
  };

  const selectAll = () => {
    const allIds = filteredSedationists.map((s) => s.id);
    setSelectedSedationists(allIds);
  };

  const clearAll = () => {
    setSelectedSedationists([]);
  };

  const handleDone = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md mx-4 h-[80vh] max-h-none p-0 gap-0">
        <DialogHeader className="p-4 pb-2 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5" />
              Select Sedationists
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col">
          {/* Search Bar */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sedationists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 p-4 border-b">
            <Button
              variant="outline"
              onClick={selectAll}
              className="flex-1"
              disabled={filteredSedationists.length === 0}
            >
              Select All ({filteredSedationists.length})
            </Button>
            <Button
              variant="outline"
              onClick={clearAll}
              className="flex-1"
              disabled={selectedSedationistIds.length === 0}
            >
              Clear All
            </Button>
          </div>

          {/* Sedationist List */}
          <div className="flex-1 overflow-y-auto">
            {filteredSedationists.length > 0 ? (
              <div className="p-2">
                {filteredSedationists.map((sedationist) => {
                  const isSelected = selectedSedationistIds.includes(sedationist.id);
                  
                  return (
                    <div
                      key={sedationist.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 cursor-pointer"
                      onClick={() => handleSedationistToggle(sedationist.id)}
                    >
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleSedationistToggle(sedationist.id)}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      
                      <div className="flex-1">
                        <p className="font-medium">
                          {sedationist.firstName} {sedationist.lastName}
                        </p>
                        {sedationist.email && (
                          <p className="text-sm text-muted-foreground">
                            {sedationist.email}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No sedationists found</p>
                  {searchTerm && (
                    <p className="text-sm mt-2">Try a different search term</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Done Button */}
          <div className="p-4 border-t">
            <Button 
              onClick={handleDone} 
              className="w-full h-12 text-base"
              size="lg"
            >
              Done ({selectedSedationistIds.length} selected)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}