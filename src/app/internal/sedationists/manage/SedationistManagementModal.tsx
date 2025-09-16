import SedationistManagementForm from "./components/SedationistManagementForm";

export interface SedationistManagementModalProps {
  sedationistId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function SedationistManagementModal({
  sedationistId,
  isOpen,
  onClose,
}: SedationistManagementModalProps) {
  return (
    <SedationistManagementForm
      sedationistId={sedationistId}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
}
