import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
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
import { CalendarIcon, Clock, X, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/shared/lib/utils";
import { useNotifications } from "@/shared/providers/NotificationProvider";
import { useAxiosClient } from "@/shared/providers/AxiosClientProvider";
import { SedationistSingleSelect } from "./SedationistSingleSelect";
import { AvailabilityStatus } from "@/api/generated/models/AvailabilityStatus";
import { CreateDiaryAvailabilityCommand } from "@/api/generated/models/CreateDiaryAvailabilityCommand";
import { getAvailabilityStatusText } from "@/app/internal/calendar/utils/availabilityUtils";
import { Separator } from "@/shared/components/ui/separator";

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
      // Create the API command
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Add New Availability</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Sedationist Selection */}
          <div className="space-y-2">
            <Label htmlFor="sedationist">Sedationist *</Label>
            <SedationistSingleSelect
              value={formData.sedationistId}
              onValueChange={(value) => updateFormData({ sedationistId: value || "" })}
              placeholder="Select a sedationist"
            />
            {errors.sedationistId && (
              <p className="text-sm text-red-500">{errors.sedationistId}</p>
            )}
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? (
                    format(formData.date, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
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
              <p className="text-sm text-red-500">{errors.date}</p>
            )}
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="startTime"
                  type="time"
                  className="pl-10"
                  value={formData.startTime}
                  onChange={(e) => updateFormData({ startTime: e.target.value })}
                />
              </div>
              {errors.startTime && (
                <p className="text-sm text-red-500">{errors.startTime}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="endTime"
                  type="time"
                  className="pl-10"
                  value={formData.endTime}
                  onChange={(e) => updateFormData({ endTime: e.target.value })}
                />
              </div>
              {errors.endTime && (
                <p className="text-sm text-red-500">{errors.endTime}</p>
              )}
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => updateFormData({ status: value as AvailabilityStatus })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select availability status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(AvailabilityStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {getAvailabilityStatusText(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes (optional)"
              value={formData.notes}
              onChange={(e) => updateFormData({ notes: e.target.value })}
              rows={3}
            />
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Creating..." : "Create Availability"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}