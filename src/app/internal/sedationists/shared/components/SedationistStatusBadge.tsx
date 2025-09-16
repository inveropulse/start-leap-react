import { Badge } from "@/shared/components/ui/badge";
import { SedationistStatus } from "@/shared/types/domains/sedation";
import { sedationistUtils } from "../utils";

interface SedationistStatusBadgeProps {
  status: SedationistStatus;
  className?: string;
}

export const SedationistStatusBadge = ({
  status,
  className,
}: SedationistStatusBadgeProps) => {
  const config = sedationistUtils.getStatusConfig(status);

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
};
