import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/shared/components/ui/card";
import { Layout } from "@/shared/components/layout/Layout";

export default function PatientPortal() {
  return (
    <Layout>
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Patient Portal</CardTitle>
            <CardDescription>Your personal health portal</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Access your appointments, medical records, and communicate with
              your care team.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
