import { Layout } from "@/shared/components/Layout";
import { PortalType } from "@/shared/services/auth/types";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/shared/components/ui/card";

export default function ClinicPortal() {
  return (
    <Layout portal={PortalType.CLINIC}>
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Clinic Portal</CardTitle>
            <CardDescription>Clinic management and operations</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Manage clinic operations, staff scheduling, and patient flow.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
