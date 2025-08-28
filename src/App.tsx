import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import "./App.css";

// Simple portal components
function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sedation Solutions Portal</CardTitle>
          <CardDescription>Sign in to access your portal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your email"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter your password"
            />
          </div>
          <Button className="w-full">Sign In</Button>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-600">Quick access (dev only):</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = "/internal")}
              >
                Internal
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = "/patient")}
              >
                Patient
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = "/sedationist")}
              >
                Sedationist
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = "/clinic")}
              >
                Clinic
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InternalPortal() {
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

function PatientPortal() {
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

function SedationistPortal() {
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

function ClinicPortal() {
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/internal" element={<InternalPortal />} />
        <Route path="/patient" element={<PatientPortal />} />
        <Route path="/sedationist" element={<SedationistPortal />} />
        <Route path="/clinic" element={<ClinicPortal />} />
      </Routes>
    </Router>
  );
}

export default App;
