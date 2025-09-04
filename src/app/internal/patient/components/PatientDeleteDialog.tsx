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
import { useDeletePatientRequest } from "../hooks/useDeletePatientRequest";
import { Patient } from "../types/patient.types";
import { useNotifications } from "@/shared/providers/NotificationProvider";

interface PatientDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient | null;
}

export function PatientDeleteDialog({ open, onOpenChange, patient }: PatientDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const deletePatientMutation = useDeletePatientRequest();
  const { addToast } = useNotifications();

  const handleDelete = async () => {
    if (!patient) return;

    setIsDeleting(true);
    try {
      await deletePatientMutation.mutateAsync(patient.id);
      toast({
        title: "Success",
        description: "Patient deleted successfully",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete patient",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Patient</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-medium">
              {patient?.firstName} {patient?.lastName}
            </span>
            ? This action cannot be undone and will permanently remove all patient data.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Patient"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}