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
import DeleteUserWarning from "./components/DeleteUserWarning";
import type { DeleteUserRequest } from "./types";
import type { ManageableUser } from "@/shared/types";
import { useDeleteUserRequest } from "@/api/user-management";

interface DeleteUserDialogProps {
  open: boolean;
  onClose: () => void;
  user: ManageableUser;
  onSuccess?: () => void;
}

const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
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
  } = useDeleteUserRequest();

  const handleDelete = async () => {
    const req: DeleteUserRequest = { userId: user.id, reason };
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
          <DialogTitle>Delete User</DialogTitle>
        </DialogHeader>
        <DeleteUserWarning userName={user.fullName || user.email} />
        <div className="mt-4">
          <label
            htmlFor="delete-reason"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Reason for deletion (optional)
          </label>
          <Input
            id="delete-reason"
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
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserDialog;
