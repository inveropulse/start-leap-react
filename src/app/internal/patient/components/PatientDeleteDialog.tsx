import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { usePatientRequest, useDeletePatientRequest } from "../hooks/usePatientRequests";
import { useNotifications } from "@/shared/providers/NotificationProvider";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface PatientDeleteDialogProps {
  patientId: string | null;
  onClose: () => void;
}

export function PatientDeleteDialog({ patientId, onClose }: PatientDeleteDialogProps) {
  const { showSuccess, showError } = useNotifications();
  const { data: patient, isLoading, isError } = usePatientRequest(patientId || undefined);
  const deletePatientMutation = useDeletePatientRequest();

  const handleDelete = async () => {
    if (!patientId) return;

    try {
      await deletePatientMutation.mutateAsync(patientId);
      showSuccess("Patient deleted successfully");
      onClose();
    } catch (error) {
      showError("Failed to delete patient. Please try again.");
    }
  };

  const isOpen = !!patientId;

  if (isError) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>
              Failed to load patient information.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Patient
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the patient
            and remove all associated data.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : (
          patient && (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/50">
                <h4 className="font-semibold">{patient.fullName}</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  {patient.email && <p>Email: {patient.email}</p>}
                  {patient.phoneNumber && <p>Phone: {patient.phoneNumber}</p>}
                  {patient.dateOfBirth && (
                    <p>
                      DOB: {new Date(patient.dateOfBirth).toLocaleDateString('en-GB')}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                <h5 className="font-medium text-destructive mb-2">Warning</h5>
                <p className="text-sm text-muted-foreground">
                  Deleting this patient will also remove:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside mt-2 space-y-1">
                  <li>All appointment history</li>
                  <li>Medical records and notes</li>
                  <li>Contact information</li>
                  <li>Any associated documents</li>
                </ul>
              </div>
            </div>
          )
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="destructive"
            disabled={deletePatientMutation.isPending || isLoading || !patient}
          >
            {deletePatientMutation.isPending ? "Deleting..." : "Delete Patient"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}