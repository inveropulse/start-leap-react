import { Badge } from "@/shared/components/ui/badge";
import { SedationistSpecialty } from "@/shared/types/domains/sedation";
import { sedationistUtils } from "../utils";

interface SedationistSpecialtyBadgeProps {
  specialty: SedationistSpecialty;
  className?: string;
}

export const SedationistSpecialtyBadge = ({
  specialty,
  className,
}: SedationistSpecialtyBadgeProps) => {
  return (
    <Badge variant="secondary" className={className}>
      {sedationistUtils.getSpecialtyLabel(specialty)}
    </Badge>
  );
};
