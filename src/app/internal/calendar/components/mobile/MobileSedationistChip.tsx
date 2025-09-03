import { Users } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useCalendarStore } from "../../store/calendarStore";
import { PortalType } from "@/shared/types";

interface MobileSedationistChipProps {
  onOpenModal: () => void;
}

export function MobileSedationistChip({ onOpenModal }: MobileSedationistChipProps) {
  const { selectedSedationistIds } = useCalendarStore(PortalType.INTERNAL);

  return (
    <Button
      variant="outline"
      onClick={onOpenModal}
      className="flex items-center gap-2 h-12 px-4 border-2 border-border hover:border-primary/50 transition-colors"
    >
      <Users className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm">
        {selectedSedationistIds.length} selected
      </span>
      <Badge variant="default" className="ml-1 h-6 min-w-[1.5rem] text-xs">
        {selectedSedationistIds.length}
      </Badge>
    </Button>
  );
}