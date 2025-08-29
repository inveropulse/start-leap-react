import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/shared/ui/card";

export default function SedationistPortal() {
  return (
    <div className="min-h-screen bg-purple-50">
      <header className="bg-purple-600 text-white p-4">
        <h1 className="text-xl font-semibold">Sedationist Portal</h1>
      </header>
      <main className="p-6">
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
      </main>
    </div>
  );
}
