import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { useLogging } from "@/shared/provider/LoggingProvider";
import { useNotifications } from "@/shared/notifications";

export default function LoginPage() {
  const logger = useLogging({
    feature: "LoginPage",
    metadata: { component: "LoginPage" },
  });
  const notifications = useNotifications();

  const handleInternalNavigation = () => {
    window.location.href = "/internal";

    logger.info("Info message -> navigating to /internal", {
      infoData: "test",
      user: "demo-user",
      action: "navigate",
    });

    notifications.showInfo("Navigating to Internal Portal", "Please wait...");
  };

  const handlePatientNavigation = () => {
    window.location.href = "/patient";
    notifications.showInfo(
      "Redirecting to Patient Portal",
      "Loading your dashboard..."
    );
  };

  const handleSedationistNavigation = () => {
    window.location.href = "/sedationist";
    notifications.showSuccess("Accessing Sedationist Portal", "Welcome back!");
  };

  const handleClinicNavigation = () => {
    window.location.href = "/clinic";
    notifications.showInfo("Opening Clinic Portal", "Connecting...");
  };

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
                onClick={handleInternalNavigation}
              >
                Internal
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePatientNavigation}
              >
                Patient
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSedationistNavigation}
              >
                Sedationist
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClinicNavigation}
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
