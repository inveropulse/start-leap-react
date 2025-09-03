import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogClose 
} from "@/shared/components/ui/dialog";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { 
  User, 
  Mail, 
  Calendar, 
  Clock, 
  FileText,
  X
} from "lucide-react";
import { DiaryAvailabilityDto } from "@/api/generated/models/DiaryAvailabilityDto";
import { 
  getAvailabilityStatusText, 
  formatAvailabilityTime
} from "../utils/availabilityUtils";
import { format } from "date-fns";

interface AvailabilityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  availability: DiaryAvailabilityDto | null;
}

export function AvailabilityDetailModal({ 
  isOpen, 
  onClose, 
  availability 
}: AvailabilityDetailModalProps) {
  if (!availability) return null;

  const statusText = getAvailabilityStatusText(availability.status);
  const timeText = formatAvailabilityTime(availability.start, availability.end);

  const availabilityDate = availability.start ? 
    format(new Date(availability.start), 'EEEE, MMMM d, yyyy') : 
    'Date not available';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Availability Details
            </DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Time */}
          <div className="flex items-center justify-between">
            <Badge className="bg-purple-500 text-white hover:bg-purple-600">
              {statusText}
            </Badge>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{availabilityDate}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-lg font-medium">
            <Clock className="h-5 w-5 text-purple-500" />
            <span>{timeText}</span>
          </div>

          <Separator />

          {/* Sedationist Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-purple-500" />
              Sedationist Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-sm">{availability.sedationistName || "Unknown Sedationist"}</p>
              </div>
              
              {availability.sedationistEmail && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{availability.sedationistEmail}</p>
                  </div>
                </div>
              )}
              
              {availability.sedationistId && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Sedationist ID</label>
                  <p className="text-sm font-mono">{availability.sedationistId}</p>
                </div>
              )}

              {availability.id && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Availability ID</label>
                  <p className="text-sm font-mono">{availability.id}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Availability Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              Availability Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <p className="text-sm">{statusText}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Duration</label>
                <p className="text-sm">{timeText}</p>
              </div>
            </div>

            {availability.notes && (
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Notes
                </label>
                <p className="text-sm bg-muted p-3 rounded-md">{availability.notes}</p>
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 text-sm text-purple-700 dark:text-purple-300">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">
                This availability period blocks appointment scheduling for {availability.sedationistName} during the specified time.
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}