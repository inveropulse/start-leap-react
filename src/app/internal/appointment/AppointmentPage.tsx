import { useState, useMemo } from 'react';
import { Plus, RefreshCw, Calendar } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { CalendarDays, Clock, Users, MapPin } from "lucide-react";
import { mockAppointments } from './data/mockData';
import { AppointmentFilters } from './components/AppointmentFilters';
import { AppointmentsTable } from './components/AppointmentsTable';
import { AppointmentViewModal } from './components/AppointmentViewModal';
import { AppointmentEditModal } from './components/AppointmentEditModal';
import { AddAvailabilityModal } from './components/AddAvailabilityModal';
import { CancelAppointmentModal } from './components/CancelAppointmentModal';
import { AppointmentPagination } from './components/AppointmentPagination';
import { Appointment, AppointmentFilters as FilterType, PaginationState, AppointmentStatus } from './types';
import { useNotifications } from '@/shared/providers/NotificationProvider';

export default function AppointmentPage() {
  const { showSuccess } = useNotifications();
  const [appointments] = useState<Appointment[]>(mockAppointments);
  const [filters, setFilters] = useState<FilterType>({
    search: '',
    status: [],
    dateFrom: undefined,
    dateTo: undefined,
  });
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 25,
    total: 0,
  });
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addAvailabilityModalOpen, setAddAvailabilityModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  // Filter and paginate appointments
  const filteredAppointments = useMemo(() => {
    let filtered = appointments;

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(apt =>
        `${apt.patient.firstName} ${apt.patient.lastName}`.toLowerCase().includes(searchLower) ||
        apt.reference.toLowerCase().includes(searchLower) ||
        apt.procedure.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(apt => filters.status.includes(apt.status));
    }

    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter(apt => apt.appointmentDate >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      filtered = filtered.filter(apt => apt.appointmentDate <= filters.dateTo!);
    }

    return filtered;
  }, [appointments, filters]);

  // Update pagination total
  useMemo(() => {
    setPagination(prev => ({ ...prev, total: filteredAppointments.length }));
  }, [filteredAppointments.length]);

  // Paginated appointments
  const paginatedAppointments = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return filteredAppointments.slice(startIndex, endIndex);
  }, [filteredAppointments, pagination.page, pagination.pageSize]);

  // Calculate stats
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayScheduled = appointments.filter(apt => apt.appointmentDate === today).length;
    const pending = appointments.filter(apt => apt.status === AppointmentStatus.SCHEDULED).length;
    const completed = appointments.filter(apt => apt.status === AppointmentStatus.COMPLETED).length;
    const activeClinics = new Set(appointments.map(apt => apt.clinic.id)).size;

    return { todayScheduled, pending, completed, activeClinics };
  }, [appointments]);

  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setViewModalOpen(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setEditModalOpen(true);
  };

  const handleSaveAppointment = (appointment: Appointment) => {
    // In a real app, this would update the appointment via API
    console.log('Saving appointment:', appointment);
  };

  const handleRefresh = async () => {
    // Simulate refresh with loading state
    const refreshBtn = document.querySelector('[data-refresh-btn]') as HTMLButtonElement;
    if (refreshBtn) {
      refreshBtn.disabled = true;
    }
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Reset filters to show "refreshed" data
    setFilters({
      search: '',
      status: [],
      dateFrom: undefined,
      dateTo: undefined,
    });
    setPagination(prev => ({ ...prev, page: 1 }));
    
    showSuccess("Appointments refreshed successfully");
    
    if (refreshBtn) {
      refreshBtn.disabled = false;
    }
  };

  const handleAddAvailability = () => {
    setAddAvailabilityModalOpen(true);
  };

  const handleCancelAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setCancelModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Appointments</h1>
          <p className="text-muted-foreground">
            View and manage individual appointments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} data-refresh-btn>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleAddAvailability}>
            <Calendar className="h-4 w-4 mr-2" />
            Add Availability
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Book Appointment
          </Button>
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
            <div className="text-2xl font-bold">{stats.todayScheduled}</div>
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
            <div className="text-2xl font-bold">{stats.pending}</div>
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
            <div className="text-2xl font-bold">{stats.completed}</div>
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
            <div className="text-2xl font-bold">{stats.activeClinics}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active locations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <AppointmentFilters
        filters={filters}
        onFiltersChange={setFilters}
        totalResults={filteredAppointments.length}
      />

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {paginatedAppointments.length > 0 ? (
            <AppointmentsTable
              appointments={paginatedAppointments}
              onViewAppointment={handleViewAppointment}
              onEditAppointment={handleEditAppointment}
              onCancelAppointment={handleCancelAppointment}
            />
          ) : (
            <div className="text-center py-12">
              <CalendarDays className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Appointments Coming Soon
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                No appointments match your current filters. Try adjusting your search criteria or check back later.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {filteredAppointments.length > 0 && (
        <AppointmentPagination
          pagination={pagination}
          onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
          onPageSizeChange={(pageSize) => setPagination(prev => ({ ...prev, pageSize, page: 1 }))}
        />
      )}

      {/* Modals */}
      <AppointmentViewModal
        appointment={selectedAppointment}
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        onEdit={handleEditAppointment}
      />

      <AppointmentEditModal
        appointment={selectedAppointment}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveAppointment}
      />

      <AddAvailabilityModal
        isOpen={addAvailabilityModalOpen}
        onClose={() => setAddAvailabilityModalOpen(false)}
      />

      <CancelAppointmentModal
        appointment={selectedAppointment}
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
      />
    </div>
  );
}
