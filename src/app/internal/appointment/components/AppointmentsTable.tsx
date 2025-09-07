import { useState } from 'react';
import { format } from 'date-fns';
import { Eye, Edit, Calendar, Phone, MapPin, MoreHorizontal, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { SearchHighlighter } from '@/shared/components/ui/SearchHighlighter';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Appointment, AppointmentStatus } from '../types';

interface AppointmentsTableProps {
  appointments: Appointment[];
  onViewAppointment: (appointment: Appointment) => void;
  onEditAppointment: (appointment: Appointment) => void;
  onCancelAppointment: (appointment: Appointment) => void;
  searchTerm?: string; // For highlighting search results
}

export function AppointmentsTable({ 
  appointments, 
  onViewAppointment, 
  onEditAppointment, 
  onCancelAppointment,
  searchTerm = ''
}: AppointmentsTableProps) {
  const getStatusVariant = (status: AppointmentStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case AppointmentStatus.CONFIRMED:
      case AppointmentStatus.COMPLETED:
        return 'default';
      case AppointmentStatus.SCHEDULED:
      case AppointmentStatus.IN_PROGRESS:
        return 'secondary';
      case AppointmentStatus.CANCELLED:
      case AppointmentStatus.NO_SHOW:
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: AppointmentStatus): string => {
    switch (status) {
      case AppointmentStatus.SCHEDULED: return 'Scheduled';
      case AppointmentStatus.CONFIRMED: return 'Confirmed';
      case AppointmentStatus.IN_PROGRESS: return 'In Progress';
      case AppointmentStatus.COMPLETED: return 'Completed';
      case AppointmentStatus.CANCELLED: return 'Cancelled';
      case AppointmentStatus.NO_SHOW: return 'No Show';
      case AppointmentStatus.RESCHEDULED: return 'Rescheduled';
      default: return status;
    }
  };

  const formatAppointmentDateTime = (date: string, time: string): string => {
    try {
      const dateTime = new Date(`${date}T${time}`);
      return format(dateTime, 'MMM dd, yyyy • HH:mm');
    } catch {
      return `${date} • ${time}`;
    }
  };

  const canCancelAppointment = (status: AppointmentStatus): boolean => {
    return ![AppointmentStatus.CANCELLED, AppointmentStatus.COMPLETED, AppointmentStatus.NO_SHOW].includes(status);
  };

  // Desktop Table View
  const DesktopTable = () => (
    <div className="hidden md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Procedure</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Clinic</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                <div>
                  <SearchHighlighter
                    text={`${appointment.patient.firstName} ${appointment.patient.lastName}`}
                    searchTerm={searchTerm}
                    className="font-semibold"
                  />
                  <div className="text-sm text-muted-foreground">{appointment.reference}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatAppointmentDateTime(appointment.appointmentDate, appointment.appointmentTime)}</span>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <SearchHighlighter
                    text={`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}
                    searchTerm={searchTerm}
                    className="font-medium"
                  />
                  <div className="text-sm text-muted-foreground">
                    <SearchHighlighter
                      text={appointment.doctor.specialization}
                      searchTerm={searchTerm}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <SearchHighlighter
                  text={appointment.procedure}
                  searchTerm={searchTerm}
                />
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(appointment.status)}>
                  {getStatusLabel(appointment.status)}
                </Badge>
              </TableCell>
              <TableCell>
                <div>
                  <SearchHighlighter
                    text={appointment.clinic.name}
                    searchTerm={searchTerm}
                    className="font-medium"
                  />
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <SearchHighlighter
                      text={appointment.clinic.address.split(',')[0]}
                      searchTerm={searchTerm}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewAppointment(appointment)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditAppointment(appointment)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {canCancelAppointment(appointment.status) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onCancelAppointment(appointment)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewAppointment(appointment)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditAppointment(appointment)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Appointment
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Phone className="h-4 w-4 mr-2" />
                        Contact Patient
                      </DropdownMenuItem>
                      {canCancelAppointment(appointment.status) && (
                        <DropdownMenuItem 
                          onClick={() => onCancelAppointment(appointment)}
                          className="text-destructive focus:text-destructive"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel Appointment
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  // Mobile Card View
  const MobileCards = () => (
    <div className="md:hidden space-y-4">
      {appointments.map((appointment) => (
        <Card key={appointment.id} className="hover:bg-muted/50 transition-colors">
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <SearchHighlighter
                    text={`${appointment.patient.firstName} ${appointment.patient.lastName}`}
                    searchTerm={searchTerm}
                    className="font-semibold"
                  />
                  <div className="text-sm text-muted-foreground">{appointment.reference}</div>
                </div>
                <Badge variant={getStatusVariant(appointment.status)}>
                  {getStatusLabel(appointment.status)}
                </Badge>
              </div>

              {/* DateTime and Doctor */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatAppointmentDateTime(appointment.appointmentDate, appointment.appointmentTime)}</span>
                </div>
                <div className="text-sm">
                  <SearchHighlighter
                    text={`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}
                    searchTerm={searchTerm}
                    className="font-medium"
                  />
                  <SearchHighlighter
                    text={` • ${appointment.doctor.specialization}`}
                    searchTerm={searchTerm}
                    className="text-muted-foreground"
                  />
                </div>
              </div>

              {/* Procedure and Clinic */}
              <div className="space-y-1">
                <SearchHighlighter
                  text={appointment.procedure}
                  searchTerm={searchTerm}
                  className="text-sm font-medium"
                />
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <SearchHighlighter
                    text={appointment.clinic.name}
                    searchTerm={searchTerm}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewAppointment(appointment)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                 <Button
                   variant="outline"
                   size="sm"
                   onClick={() => onEditAppointment(appointment)}
                   className="flex-1"
                 >
                   <Edit className="h-4 w-4 mr-2" />
                   Edit
                 </Button>
                 {canCancelAppointment(appointment.status) && (
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={() => onCancelAppointment(appointment)}
                     className="text-destructive hover:text-destructive"
                   >
                     <X className="h-4 w-4" />
                   </Button>
                 )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No Appointments Found</h3>
        <p className="text-muted-foreground">
          No appointments match your current filters. Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  return (
    <>
      <DesktopTable />
      <MobileCards />
    </>
  );
}