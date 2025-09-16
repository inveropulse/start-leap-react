import { SedationistDeletionConfirmation } from "./components/SedationistDeletionConfirmation";

export interface DeleteSedationistDialogProps {
  sedationistId: string;
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => void;
}
export function DeleteSedationistDialog({
  sedationistId,
  isOpen,
  onClose,
  onDeleted,
}: DeleteSedationistDialogProps) {
  return (
    <SedationistDeletionConfirmation
      sedationistId={sedationistId}
      isOpen={isOpen}
      onClose={onClose}
      onDeleted={onDeleted}
    />
  );
}
