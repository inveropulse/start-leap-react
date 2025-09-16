import CreateSedationistForm from "./components/CreateSedationistForm";

export interface CreateSedationistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateSedationistModal({
  open,
  onOpenChange,
}: CreateSedationistModalProps) {
  return <CreateSedationistForm open={open} onOpenChange={onOpenChange} />;
}
