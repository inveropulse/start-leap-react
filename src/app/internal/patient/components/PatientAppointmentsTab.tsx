import { Calendar, Clock, MapPin, User, Plus, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { usePatientAppointments } from "../hooks/usePatientAppointments";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { quickActionTo } from "@/shared/utils/quickAction";
import { InternalQuickActionKey, InternalRoute } from "@/routes/internal_routes";
import { useState } from "react";

interface PatientAppointmentsTabProps {
  patientId: string;
  patientPhone?: string;
}

export function PatientAppointmentsTab({ patientId, patientPhone }: PatientAppointmentsTabProps) {
  const navigate = useNavigate();
  const { data: appointments, isLoading } = usePatientAppointments(patientId);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleBookAppointment = () => {
    navigate(quickActionTo(InternalRoute.APPOINTMENTS, InternalQuickActionKey.NEW_APPOINTMENT, { patientId }));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateTime: string) => {
    try {
      return format(new Date(dateTime), "MMM dd, yyyy 'at' h:mm a");
    } catch {
      return "Invalid date";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const upcomingAppointments = appointments?.upcoming || [];
  const pastAppointments = appointments?.past || [];
  
  // Pagination calculations
  const totalPages = Math.ceil(pastAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageAppointments = pastAppointments.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="space-y-6">
      {/* Quick Book Appointment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Quick Actions</span>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleBookAppointment}>
              <Plus className="mr-2 h-4 w-4" />
              Book Appointment
            </Button>
            {patientPhone && (
              <Button variant="outline" size="sm" asChild>
                <a href={`tel:${patientPhone}`}>
                  <Phone className="mr-2 h-4 w-4" />
                  Contact Patient
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Upcoming Appointments ({upcomingAppointments.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingAppointments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No upcoming appointments scheduled</p>
          ) : (
            upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{formatDateTime(appointment.dateTime)}</span>
                      <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Dr. {appointment.doctorName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{appointment.clinicName}</span>
                    </div>
                    {appointment.procedure && (
                      <div className="text-sm text-muted-foreground">
                        Procedure: {appointment.procedure}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">View Details</Button>
                    <Button variant="outline" size="sm">Reschedule</Button>
                  </div>
                </div>
                {appointment.notes && (
                  <>
                    <Separator />
                    <div className="text-sm text-muted-foreground">
                      <strong>Notes:</strong> {appointment.notes}
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Past Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Appointment History ({pastAppointments.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pastAppointments.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No appointment history</p>
          ) : (
            <>
              {currentPageAppointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4 space-y-2 opacity-75">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{formatDateTime(appointment.dateTime)}</span>
                        <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Dr. {appointment.doctorName} • {appointment.clinicName}
                      </div>
                      {appointment.procedure && (
                        <div className="text-sm text-muted-foreground">
                          {appointment.procedure}
                        </div>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">View Report</Button>
                  </div>
                </div>
              ))}
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1}-{Math.min(endIndex, pastAppointments.length)} of {pastAppointments.length} appointments
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Appointment Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Appointment Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...upcomingAppointments, ...pastAppointments]
              .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
              .slice(0, 8)
              .map((appointment, index) => (
                <div key={appointment.id} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-3 h-3 bg-primary rounded-full mt-2"></div>
                  <div className="flex-grow border-l border-muted pl-4 pb-4">
                    <div className="text-sm font-medium">{formatDateTime(appointment.dateTime)}</div>
                    <div className="text-sm text-muted-foreground">
                      {appointment.procedure} with Dr. {appointment.doctorName}
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}