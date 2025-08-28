import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

export default function InternalPortal() {
  return (
    <div className="min-h-screen bg-blue-50">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-semibold">Internal Portal</h1>
      </header>
      <main className="p-6">
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
      </main>
    </div>
  );
}
