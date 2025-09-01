import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/shared/components/ui/card";
import { Layout } from "@/shared/components/layout/Layout";
import { getPortalByType } from "@/routes/registry";
import { PortalType } from "@/shared/types";

export default function InternalPortal() {
  const portalConfig = getPortalByType(PortalType.INTERNAL);

  return (
    <Layout>
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
    </Layout>
  );
}
