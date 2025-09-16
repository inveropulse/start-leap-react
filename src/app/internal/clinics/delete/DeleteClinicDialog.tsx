import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { useToast } from "@/shared/hooks/use-toast";
import { useDeleteClinicRequest } from "../../../../api/clinics";
import { Clinic } from "../../../../shared/types/domains/clinic/entities";

interface DeleteClinicDialogProps {
  clinic: Clinic | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}

export function DeleteClinicDialog({
  clinic,
  open,
  onOpenChange,
  onDeleted,
}: DeleteClinicDialogProps) {
  const { toast } = useToast();
  const deleteMutation = useDeleteClinicRequest();

  const handleDelete = async () => {
    if (!clinic?.id) return;

    try {
      const response = await deleteMutation.mutateAsync(clinic.id);
      if (response.successful) {
        toast({
          title: "Success",
          description: response.message || "Clinic deleted successfully",
        });
        onDeleted?.();
        onOpenChange(false);
      } else {
        throw new Error(response.message || "Failed to delete clinic");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete clinic",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-destructive">Delete Clinic</DialogTitle>
          <DialogDescription className="space-y-2">
            <p>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{clinic?.name}</span>?
            </p>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone. This will permanently delete the
              clinic record and all associated data.
            </p>
            {clinic?.doctorCount && clinic.doctorCount > 0 && (
              <p className="text-sm text-orange-600 font-medium">
                Warning: This clinic has {clinic.doctorCount} associated
                doctor(s).
              </p>
            )}
            {clinic?.activeAppointmentCount &&
              clinic.activeAppointmentCount > 0 && (
                <p className="text-sm text-red-600 font-medium">
                  Warning: This clinic has {clinic.activeAppointmentCount}{" "}
                  active appointment(s).
                </p>
              )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete Clinic"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
