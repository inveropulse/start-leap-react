import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/shared/components/ui/card";
import { PortalType } from "@/shared/types";
import { getPortalByType } from "@/routes/registry";

export default function InternalPortal() {
  const portalConfig = getPortalByType(PortalType.INTERNAL);

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to {portalConfig.name}</CardTitle>
          <CardDescription>{portalConfig.summaryDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{portalConfig.description}</p>
        </CardContent>
      </Card>
    </div>
  );
}
