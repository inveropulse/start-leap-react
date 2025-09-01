import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/shared/components/ui/card";

export default function SedationistPortal() {
  return (
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
  );
}
