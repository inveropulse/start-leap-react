import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/shared/ui/card";

export default function PatientPortal() {
  return (
    <div className="min-h-screen bg-green-50">
      <header className="bg-green-600 text-white p-4">
        <h1 className="text-xl font-semibold">Patient Portal</h1>
      </header>
      <main className="p-6">
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
      </main>
    </div>
  );
}
