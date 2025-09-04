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
import { Loader2, AlertTriangle } from "lucide-react";

interface PatientDeleteDialogProps {
  patient: Patient | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PatientDeleteDialog({ patient, isOpen, onClose }: PatientDeleteDialogProps) {
  const deletePatientMutation = useDeletePatientRequest();
  const { showSuccess, showError } = useNotifications();

  const handleDelete = async () => {
    if (!patient) return;

    try {
      await deletePatientMutation.mutateAsync(patient.id);
      showSuccess(`Patient ${patient.fullName} has been deleted`);
      onClose();
    } catch (error) {
      showError("Failed to delete patient");
    }
  };

  if (!patient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <DialogTitle>Delete Patient</DialogTitle>
          </div>
          <DialogDescription className="text-left">
            Are you sure you want to delete <strong>{patient.fullName}</strong>?
            This action cannot be undone and will permanently remove all patient data.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deletePatientMutation.isPending}
          >
            {deletePatientMutation.isPending && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            Delete Patient
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}