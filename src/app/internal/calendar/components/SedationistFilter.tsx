import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Users, UserCheck, User } from "lucide-react";
import { useCalendarStore } from "../store/calendarStore";
import { PortalType } from "@/shared/types";

export function SedationistFilter() {
  const {
    sedationists,
    selectedSedationistIds,
    setSelectedSedationists,
    isLoadingSedationists,
  } = useCalendarStore(PortalType.INTERNAL);

  const handleSedationistToggle = (sedationistId: string) => {
    const newSelection = selectedSedationistIds.includes(sedationistId)
      ? selectedSedationistIds.filter(id => id !== sedationistId)
      : [...selectedSedationistIds, sedationistId];
    
    setSelectedSedationists(newSelection);
  };

  const selectAll = () => {
    const allIds = sedationists?.map(s => s.id) || [];
    setSelectedSedationists(allIds);
  };

  const selectNone = () => {
    setSelectedSedationists([]);
  };

  if (isLoadingSedationists) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Sedationists
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Users className="h-4 w-4" />
          Sedationists ({selectedSedationistIds.length}/{sedationists?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Select All/None buttons */}
        <div className="flex gap-2 mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={selectAll}
            className="flex-1 text-xs"
          >
            All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={selectNone}
            className="flex-1 text-xs"
          >
            None
          </Button>
        </div>

        {/* Sedationist list */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {sedationists?.map((sedationist) => {
            const isSelected = selectedSedationistIds.includes(sedationist.id);
            
            return (
              <div 
                key={sedationist.id} 
                className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                onClick={() => handleSedationistToggle(sedationist.id)}
              >
                <Checkbox
                  checked={isSelected}
                  onChange={() => handleSedationistToggle(sedationist.id)}
                  className="data-[state=checked]:bg-primary"
                />
                
                <div className="flex items-center gap-2 flex-1">
                  {isSelected ? (
                    <UserCheck className="h-4 w-4 text-primary" />
                  ) : (
                    <User className="h-4 w-4 text-muted-foreground" />
                  )}
                  
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {sedationist.firstName} {sedationist.lastName}
                    </p>
                    {sedationist.email && (
                      <p className="text-xs text-muted-foreground">
                        {sedationist.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Availability indicator */}
                <div className={`w-2 h-2 rounded-full ${
                  isSelected ? 'bg-primary' : 'bg-muted-foreground/30'
                }`} />
              </div>
            );
          })}
        </div>

        {!sedationists?.length && (
          <div className="text-center py-4 text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No sedationists available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}