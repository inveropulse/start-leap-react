import { Layout } from "@/shared/components/Layout";
import { PortalType } from "@/shared/services/auth/types";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/shared/components/ui/card";

export default function SedationistPortal() {
  return (
    <Layout portal={PortalType.SEDATIONIST}>
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Sedationist Portal</CardTitle>
            <CardDescription>Specialized sedation management</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Manage sedation procedures, monitor patients, and maintain
              certification records.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
