import { useCallback, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuickAction } from "@/shared/hooks/useQuickAction";
import { InternalQuickActionKey } from "@/routes/internal_routes";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/shared/utils/cn";
import { 
  Calendar, 
  MapPin, 
  User, 
  Clock,
  FileText,
  AlertTriangle,
  ArrowLeft
} from "lucide-react";
import { AppointmentItem } from "../dashboard/types/dashboard.types";

// Mock function to get appointment by ID - replace with actual API call
const getAppointmentById = (id: string): AppointmentItem | null => {
  // This would normally be an API call
  // For now, return mock data based on the ID
  return {
    id: id,
    reference: `APP-${id}`,
    patientTitle: "Mrs",
    patientName: "Sarah Johnson",
    clinicName: "Harley Street Dental",
    doctorTitle: "Dr",
    doctorName: "Emily Watson",
    sedationistTitle: "Dr", 
    sedationistName: "Michael Chen",
    status: "confirmed",
    startTime: new Date(2024, 0, 15, 9, 0),
    endTime: new Date(2024, 0, 15, 10, 30),
    procedure: "Wisdom tooth extraction with IV sedation",
    type: "upcoming",
    color: "blue",
    icon: "Calendar",
    requiresAttention: false,
  };
};

export default function AppointmentPage() {
  const [searchParams] = useSearchParams();
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleQA = useCallback((qa: string) => {
    switch (qa) {
      case InternalQuickActionKey.VIEW_APPOINTMENT:
        const appointmentId = searchParams.get('appointmentId');
        if (appointmentId) {
          setIsLoading(true);
          // Simulate API call
          setTimeout(() => {
            const appointment = getAppointmentById(appointmentId);
            setSelectedAppointment(appointment);
            setIsLoading(false);
          }, 500);
        }
        break;
      case InternalQuickActionKey.NEW_APPOINTMENT:
        // Handle new appointment creation
        console.log("New appointment action");
        break;
    }
  }, [searchParams]);

  useQuickAction(handleQA);

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-700';
      case 'pending': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'attention': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-6 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!selectedAppointment) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No appointment selected</h3>
              <p className="text-muted-foreground mb-4">
                Select an appointment from the dashboard to view its details.
              </p>
              <Button>
                <Calendar className="h-4 w-4 mr-2" />
                New Appointment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button size="sm">
            Edit Appointment
          </Button>
        </div>
      </div>

      {/* Appointment Details */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">
                Appointment #{selectedAppointment.reference}
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                {selectedAppointment.patientTitle ? 
                  `${selectedAppointment.patientTitle}. ${selectedAppointment.patientName}` : 
                  selectedAppointment.patientName
                }
              </p>
            </div>
            <span className={cn(
              "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
              getStatusColor(selectedAppointment.status)
            )}>
              {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date and Time */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Schedule
            </h3>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="font-medium">{formatDateTime(selectedAppointment.startTime)}</p>
              <p className="text-sm text-muted-foreground">
                Duration: {Math.round((selectedAppointment.endTime.getTime() - selectedAppointment.startTime.getTime()) / (1000 * 60))} minutes
              </p>
            </div>
          </div>

          <Separator />

          {/* Location and Staff */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </h3>
              <p>{selectedAppointment.clinicName}</p>
            </div>

            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Medical Team
              </h3>
              <div className="space-y-2">
                {selectedAppointment.doctorName && (
                  <p className="text-sm">
                    <span className="font-medium">Doctor:</span> {selectedAppointment.doctorTitle || 'Dr'}. {selectedAppointment.doctorName}
                  </p>
                )}
                <p className="text-sm">
                  <span className="font-medium">Sedationist:</span> {selectedAppointment.sedationistTitle || 'Dr'}. {selectedAppointment.sedationistName}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Procedure */}
          {selectedAppointment.procedure && (
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Procedure
              </h3>
              <p>{selectedAppointment.procedure}</p>
            </div>
          )}

          {/* Attention Required */}
          {selectedAppointment.requiresAttention && selectedAppointment.attentionReason && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium mb-3 flex items-center gap-2 text-amber-700">
                  <AlertTriangle className="h-4 w-4" />
                  Requires Attention
                </h3>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-amber-800">{selectedAppointment.attentionReason}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}