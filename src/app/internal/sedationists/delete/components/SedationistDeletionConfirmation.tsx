import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Badge } from "@/shared/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import {
  AlertTriangle,
  Trash2,
  Loader2,
  User,
  Calendar,
  FileText,
} from "lucide-react";
import { useSedationistDeletion } from "../hooks/useSedationistDeletion";

interface SedationistDeletionConfirmationProps {
  sedationistId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleted?: () => void;
}

export function SedationistDeletionConfirmation({
  sedationistId,
  isOpen,
  onClose,
  onDeleted,
}: SedationistDeletionConfirmationProps) {
  // Use extracted business logic hook
  const {
    sedationist,
    isLoading,
    error,
    isDeleting,
    confirmationText,
    setConfirmationText,
    handleDelete,
    canDelete,
    warningMessages,
  } = useSedationistDeletion(sedationistId);

  const handleConfirmDelete = async () => {
    await handleDelete();
    if (!isDeleting) {
      onDeleted?.();
      onClose();
    }
  };

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Error Loading Sedationist
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Failed to load sedationist details for deletion.
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (isLoading || !sedationist) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Loading...</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Delete Sedationist
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            sedationist's profile.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Sedationist Info */}
          <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/50">
            <Avatar className="h-10 w-10">
              <AvatarImage src={sedationist.avatar} />
              <AvatarFallback>
                {sedationist.firstName[0]}
                {sedationist.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold">
                {sedationist.firstName} {sedationist.lastName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {sedationist.email}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {sedationist.specialties.length} specialties
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {sedationist.totalProcedures} procedures
                </Badge>
              </div>
            </div>
          </div>

          {/* Warning Messages */}
          {warningMessages.length > 0 && (
            <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
              <div className="flex gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="font-semibold text-orange-800">Please note:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-orange-700">
                    {warningMessages.map((message, index) => (
                      <li key={index}>{message}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Input */}
          <div className="space-y-2">
            <Label htmlFor="confirmation">
              Type{" "}
              <span className="font-semibold">
                {sedationist.firstName} {sedationist.lastName}
              </span>{" "}
              to confirm deletion:
            </Label>
            <Input
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Enter full name..."
              disabled={isDeleting}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={!canDelete || isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Sedationist
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
