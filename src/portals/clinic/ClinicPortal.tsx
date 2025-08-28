import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

export default function ClinicPortal() {
  return (
    <div className="min-h-screen bg-orange-50">
      <header className="bg-orange-600 text-white p-4">
        <h1 className="text-xl font-semibold">Clinic Portal</h1>
      </header>
      <main className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Clinic Portal</CardTitle>
            <CardDescription>Clinic management and operations</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Manage clinic operations, staff scheduling, and patient flow.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
