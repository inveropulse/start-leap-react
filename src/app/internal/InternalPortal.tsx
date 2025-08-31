import { Layout } from "@/shared/components/Layout";
import { PortalType } from "@/shared/services/auth/types";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/shared/components/ui/card";

export default function InternalPortal() {
  return (
    <Layout portal={PortalType.INTERNAL}>
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Internal Portal</CardTitle>
            <CardDescription>Administrative and staff portal</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              This is where internal staff can manage operations, view reports,
              and handle administrative tasks.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
