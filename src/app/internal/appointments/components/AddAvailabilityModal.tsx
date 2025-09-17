import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
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
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { 
  CalendarIcon, 
  Clock, 
  User, 
  FileText, 
  AlertCircle, 
  Timer, 
  CheckCircle2,
  Loader2 
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/shared/lib/utils";
import { useNotifications } from "@/shared/providers/NotificationProvider";
import { useAxiosClient } from "@/shared/providers/AxiosClientProvider";
import { SedationistSingleSelect } from "./SedationistSingleSelect";
import { AvailabilityStatus } from "@/api/generated/models/AvailabilityStatus";
import { CreateDiaryAvailabilityCommand } from "@/api/generated/models/CreateDiaryAvailabilityCommand";
import { getAvailabilityStatusText } from "@/app/internal/calendar/utils/availabilityUtils";

interface AddAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  sedationistId: string;
  date: Date | undefined;
  startTime: string;
  endTime: string;
  status: AvailabilityStatus | "";
  notes: string;
}

interface FormErrors {
  sedationistId?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
  notes?: string;
}

// Status color mappings using portal theme
const getStatusVariant = (status: AvailabilityStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case AvailabilityStatus.UNAVAILABLE:
    case AvailabilityStatus.CANCELLED:
      return "destructive";
    case AvailabilityStatus.ON_LEAVE:
    case AvailabilityStatus.RESCHEDULED:
      return "secondary";
    case AvailabilityStatus.PERSONAL_REASON:
      return "outline";
    default:
      return "default";
  }
};

const getStatusColor = (status: AvailabilityStatus): string => {
  switch (status) {
    case AvailabilityStatus.UNAVAILABLE:
    case AvailabilityStatus.CANCELLED:
      return "text-destructive";
    case AvailabilityStatus.ON_LEAVE:
    case AvailabilityStatus.RESCHEDULED:
      return "text-portal-internal-accent";
    case AvailabilityStatus.MEETING:
    case AvailabilityStatus.ATTENDING_WORKSHOP:
      return "text-portal-internal-primary";
    case AvailabilityStatus.PERSONAL_REASON:
      return "text-muted-foreground";
    default:
      return "text-foreground";
  }
};

export function AddAvailabilityModal({ isOpen, onClose }: AddAvailabilityModalProps) {
  const { showSuccess, showError } = useNotifications();
  const { apiClient } = useAxiosClient();
  const [formData, setFormData] = useState<FormData>({
    sedationistId: "",
    date: undefined,
    startTime: "",
    endTime: "",
    status: "",
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Calculate duration in real-time
  const duration = useMemo(() => {
    if (!formData.startTime || !formData.endTime) return null;
    
    const [startHour, startMin] = formData.startTime.split(':').map(Number);
    const [endHour, endMin] = formData.endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    if (endMinutes <= startMinutes) return null;
    
    const diffMinutes = endMinutes - startMinutes;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  }, [formData.startTime, formData.endTime]);

  // Form completion status
  const isFormComplete = useMemo(() => {
    return formData.sedationistId && 
           formData.date && 
           formData.startTime && 
           formData.endTime && 
           formData.status &&
           duration; // Must have valid duration
  }, [formData, duration]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.sedationistId) {
      newErrors.sedationistId = "Please select a sedationist";
    }
    if (!formData.date) {
      newErrors.date = "Please select a date";
    }
    if (!formData.startTime) {
      newErrors.startTime = "Please enter start time";
    }
    if (!formData.endTime) {
      newErrors.endTime = "Please enter end time";
    }
    if (!formData.status) {
      newErrors.status = "Please select a status";
    }

    // Validate time range
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      if (start >= end) {
        newErrors.endTime = "End time must be after start time";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const createCommand: CreateDiaryAvailabilityCommand = {
        sedationistId: formData.sedationistId,
        availabilityStatus: formData.status as AvailabilityStatus,
        notes: formData.notes || null,
        start: formData.date && formData.startTime 
          ? `${format(formData.date, 'yyyy-MM-dd')}T${formData.startTime}:00`
          : undefined,
        end: formData.date && formData.endTime
          ? `${format(formData.date, 'yyyy-MM-dd')}T${formData.endTime}:00`
          : undefined,
      };

      const response = await apiClient.diary.postApiDiaryCreateDiaryAvailability(createCommand);
      
      if (response.successful) {
        showSuccess("Availability created successfully");
        handleClose();
      } else {
        throw new Error(response.message || "Failed to create availability");
      }
    } catch (error) {
      console.error("Error creating availability:", error);
      showError("Failed to create availability", error instanceof Error ? error.message : "Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      sedationistId: "",
      date: undefined,
      startTime: "",
      endTime: "",
      status: "",
      notes: "",
    });
    setErrors({});
    onClose();
  };

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    // Clear errors for updated fields
    Object.keys(updates).forEach(key => {
      if (errors[key as keyof FormErrors]) {
        setErrors(prev => ({ ...prev, [key]: undefined }));
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="h-10 w-10 rounded-lg bg-portal-internal-primary/10 flex items-center justify-center">
              <CalendarIcon className="h-5 w-5 text-portal-internal-primary" />
            </div>
            Add New Availability
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* Form Progress Indicator */}
          {isFormComplete && (
            <div className="flex items-center gap-2 p-3 bg-portal-internal-secondary/50 rounded-lg border border-portal-internal-primary/20">
              <CheckCircle2 className="h-4 w-4 text-portal-internal-primary" />
              <span className="text-sm text-portal-internal-primary font-medium">
                Form is complete and ready to submit
              </span>
            </div>
          )}

          {/* Sedationist Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2">
              <User className="h-4 w-4 text-portal-internal-primary" />
              <h3 className="font-semibold text-base">Sedationist Selection</h3>
            </div>
            <div className="bg-card/50 p-4 rounded-lg border">
              <Label htmlFor="sedationist" className="text-sm font-medium mb-3 block">
                Choose the sedationist for this availability
              </Label>
              <SedationistSingleSelect
                value={formData.sedationistId}
                onValueChange={(value) => updateFormData({ sedationistId: value || "" })}
                placeholder="Search and select a sedationist..."
              />
              {errors.sedationistId && (
                <p className="text-sm text-destructive flex items-center gap-1 mt-2">
                  <AlertCircle className="h-3 w-3" />
                  {errors.sedationistId}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Date & Time Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2">
              <Clock className="h-4 w-4 text-portal-internal-primary" />
              <h3 className="font-semibold text-base">Date & Time</h3>
            </div>
            
            <div className="bg-card/50 p-4 rounded-lg border space-y-4">
              {/* Date Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-11",
                        !formData.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "EEEE, MMMM do, yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => updateFormData({ date })}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.date}
                  </p>
                )}
              </div>

              {/* Time Range */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Time Range</Label>
                  {duration && (
                    <div className="flex items-center gap-1 text-sm text-portal-internal-primary">
                      <Timer className="h-3 w-3" />
                      <span className="font-medium">{duration}</span>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-time" className="text-xs text-muted-foreground font-medium">
                      Start Time
                    </Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="start-time"
                        type="time"
                        className="pl-10 h-11"
                        value={formData.startTime}
                        onChange={(e) => updateFormData({ startTime: e.target.value })}
                      />
                    </div>
                    {errors.startTime && (
                      <p className="text-xs text-destructive">{errors.startTime}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time" className="text-xs text-muted-foreground font-medium">
                      End Time
                    </Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="end-time"
                        type="time"
                        className="pl-10 h-11"
                        value={formData.endTime}
                        onChange={(e) => updateFormData({ endTime: e.target.value })}
                      />
                    </div>
                    {errors.endTime && (
                      <p className="text-xs text-destructive">{errors.endTime}</p>
                    )}
                  </div>
                </div>

                {/* Time range validation message */}
                {formData.startTime && formData.endTime && !duration && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    End time must be after start time
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Status Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2">
              <Badge className="h-4 w-4 text-portal-internal-primary bg-transparent p-0" />
              <h3 className="font-semibold text-base">Availability Status</h3>
            </div>
            
            <div className="bg-card/50 p-4 rounded-lg border">
              <Label className="text-sm font-medium mb-3 block">
                Select the reason for unavailability
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => updateFormData({ status: value as AvailabilityStatus })}
              >
                <SelectTrigger className="w-full h-12">
                  <SelectValue placeholder="Choose status">
                    {formData.status && (
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusVariant(formData.status as AvailabilityStatus)} className="text-xs px-2 py-1">
                          {getAvailabilityStatusText(formData.status as AvailabilityStatus)}
                        </Badge>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {Object.values(AvailabilityStatus).map((status) => (
                    <SelectItem key={status} value={status} className="cursor-pointer">
                      <div className="flex items-center gap-3 py-1">
                        <Badge variant={getStatusVariant(status)} className="text-xs px-2 py-1">
                          {getAvailabilityStatusText(status)}
                        </Badge>
                        <span className={cn("text-sm", getStatusColor(status))}>
                          {getAvailabilityStatusText(status)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-destructive flex items-center gap-1 mt-2">
                  <AlertCircle className="h-3 w-3" />
                  {errors.status}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Notes Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2">
              <FileText className="h-4 w-4 text-portal-internal-primary" />
              <h3 className="font-semibold text-base">Additional Information</h3>
              <Badge variant="secondary" className="text-xs">Optional</Badge>
            </div>
            
            <div className="bg-card/50 p-4 rounded-lg border">
              <Label htmlFor="notes" className="text-sm font-medium mb-3 block">
                Add any relevant notes or details
              </Label>
              <Textarea
                id="notes"
                placeholder="e.g., Contact information, special instructions, or additional context..."
                value={formData.notes}
                onChange={(e) => updateFormData({ notes: e.target.value })}
                rows={3}
                className="min-h-[80px] resize-none"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 pt-6 border-t">
          <Button 
            variant="outline" 
            onClick={handleClose} 
            disabled={isLoading}
            className="mb-2 sm:mb-0"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !isFormComplete}
            className="bg-portal-internal-primary hover:bg-portal-internal-primary/90 text-white min-w-[140px]"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Creating...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>Create Availability</span>
              </div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}