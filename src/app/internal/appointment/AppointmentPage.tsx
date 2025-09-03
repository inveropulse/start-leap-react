import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { CalendarDays, Clock, Users, MapPin } from "lucide-react";

export default function AppointmentPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-center">
        <div className="flex items-center gap-3">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Appointments</h1>
            <p className="text-muted-foreground">
              View and manage individual appointments
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">
              Appointments scheduled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">
              Successfully finished
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Clinics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active locations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Appointments Area - Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Appointment Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <CalendarDays className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Appointment Features Coming Soon
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              This will be the dedicated appointments view where you can manage
              individual appointments, view details, update statuses, and handle
              patient communications.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
