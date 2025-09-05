import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Calendar } from "@/shared/components/ui/calendar";
import { cn } from "@/shared/utils/cn";
import { useNotifications } from "@/shared/providers/NotificationProvider";

interface AddAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  sedationistId: string;
  date: Date | undefined;
  startTime: string;
  endTime: string;
  status: "AVAILABLE" | "UNAVAILABLE" | "TENTATIVE";
  notes: string;
}

export function AddAvailabilityModal({ isOpen, onClose }: AddAvailabilityModalProps) {
  const { showSuccess, showError } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  
  const [formData, setFormData] = useState<FormData>({
    sedationistId: "",
    date: undefined,
    startTime: "09:00",
    endTime: "17:00",
    status: "AVAILABLE",
    notes: "",
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.sedationistId) {
      newErrors.sedationistId = "Sedationist is required";
    }
    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    if (!formData.startTime) {
      newErrors.startTime = "Start time is required";
    }
    if (!formData.endTime) {
      newErrors.endTime = "End time is required";
    }
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = "End time must be after start time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Creating availability:", {
        ...formData,
        start: `${format(formData.date!, 'yyyy-MM-dd')}T${formData.startTime}:00`,
        end: `${format(formData.date!, 'yyyy-MM-dd')}T${formData.endTime}:00`,
      });

      showSuccess("Availability created successfully");
      handleClose();
    } catch (error) {
      console.error("Error creating availability:", error);
      showError("Failed to create availability");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      sedationistId: "",
      date: undefined,
      startTime: "09:00",
      endTime: "17:00",
      status: "AVAILABLE",
      notes: "",
    });
    setErrors({});
    onClose();
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Add Availability
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sedationist Selection */}
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Sedationist
            </label>
            <Select onValueChange={(value) => updateFormData('sedationistId', value)} value={formData.sedationistId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select sedationist" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sed-1">Dr. Sarah Johnson</SelectItem>
                <SelectItem value="sed-2">Dr. Michael Chen</SelectItem>
                <SelectItem value="sed-3">Dr. Emily Rodriguez</SelectItem>
                <SelectItem value="sed-4">Dr. David Williams</SelectItem>
              </SelectContent>
            </Select>
            {errors.sedationistId && (
              <p className="text-sm text-destructive mt-1">{errors.sedationistId}</p>
            )}
          </div>

          {/* Date Selection */}
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  {formData.date ? (
                    format(formData.date, "PPP")
                  ) : (
                    <span>Select date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => updateFormData('date', date)}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="text-sm text-destructive mt-1">{errors.date}</p>
            )}
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Start Time
              </label>
              <Input
                type="time"
                value={formData.startTime}
                onChange={(e) => updateFormData('startTime', e.target.value)}
                className="mt-1"
              />
              {errors.startTime && (
                <p className="text-sm text-destructive mt-1">{errors.startTime}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                End Time
              </label>
              <Input
                type="time"
                value={formData.endTime}
                onChange={(e) => updateFormData('endTime', e.target.value)}
                className="mt-1"
              />
              {errors.endTime && (
                <p className="text-sm text-destructive mt-1">{errors.endTime}</p>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Status
            </label>
            <Select onValueChange={(value: any) => updateFormData('status', value)} value={formData.status}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AVAILABLE">Available</SelectItem>
                <SelectItem value="UNAVAILABLE">Unavailable</SelectItem>
                <SelectItem value="TENTATIVE">Tentative</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Notes (Optional)
            </label>
            <Textarea
              placeholder="Add any additional notes..."
              className="resize-none mt-1"
              rows={3}
              value={formData.notes}
              onChange={(e) => updateFormData('notes', e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Availability"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}