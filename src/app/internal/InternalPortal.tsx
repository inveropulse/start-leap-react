import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/shared/components/ui/card";
import { Layout } from "@/shared/components/layout/Layout";

export default function InternalPortal() {
  return (
    <Layout>
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
