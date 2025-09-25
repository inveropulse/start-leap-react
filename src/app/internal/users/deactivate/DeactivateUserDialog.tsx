import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import DeactivateUserWarning from "./components/DeactivateUserWarning";
import { useDeactivateUserRequest } from "@/api/user-management/deactivate";
import type { DeactivateUserRequest } from "./types";
import type { ManageableUser } from "@/shared/types";

interface DeactivateUserDialogProps {
  open: boolean;
  onClose: () => void;
  user: ManageableUser;
  onSuccess?: () => void;
}

const DeactivateUserDialog: React.FC<DeactivateUserDialogProps> = ({
  open,
  onClose,
  user,
  onSuccess,
}) => {
  const [reason, setReason] = useState("");
  const {
    mutateAsync,
    isPending: isSubmitting,
    error,
    reset,
  } = useDeactivateUserRequest();

  const handleDeactivate = async () => {
    const req: DeactivateUserRequest = { userId: user.id, reason };
    await mutateAsync(req);
    if (onSuccess) onSuccess();
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setReason("");
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deactivate User</DialogTitle>
        </DialogHeader>
        <DeactivateUserWarning userName={user.fullName || user.email} />
        <div className="mt-4">
          <label
            htmlFor="deactivate-reason"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Reason for deactivation (optional)
          </label>
          <Input
            id="deactivate-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason (optional)"
            disabled={isSubmitting}
          />
        </div>
        {error && (
          <div className="text-red-600 text-sm mt-2">{error.message}</div>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeactivate}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Deactivating..." : "Deactivate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeactivateUserDialog;
