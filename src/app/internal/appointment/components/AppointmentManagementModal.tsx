import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Badge } from '@/shared/components/ui/badge';
import { Appointment, AppointmentStatus } from '../types';
import { AppointmentManagement } from '../types/management.types';
import { appointmentManagementService } from '../services/appointmentManagementService';
import { AppointmentDetailsTab } from './tabs/AppointmentDetailsTab';
import { AppointmentTrackTab } from './tabs/AppointmentTrackTab';
import { AppointmentDocumentsTab } from './tabs/AppointmentDocumentsTab';
import { AppointmentPaymentTab } from './tabs/AppointmentPaymentTab';

interface AppointmentManagementModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (appointment: Appointment) => void;
}

export function AppointmentManagementModal({
  appointment,
  isOpen,
  onClose,
  onSave,
}: AppointmentManagementModalProps) {
  const [activeTab, setActiveTab] = useState('details');
  const [managementData, setManagementData] = useState<AppointmentManagement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load appointment management data
  useEffect(() => {
    if (appointment && isOpen) {
      loadManagementData();
    }
  }, [appointment, isOpen]);

  const loadManagementData = async () => {
    if (!appointment) return;
    
    setIsLoading(true);
    try {
      const [documents, activities, payments] = await Promise.all([
        appointmentManagementService.getAppointmentDocuments(appointment.id),
        appointmentManagementService.getAppointmentActivities(appointment.id),
        appointmentManagementService.getAppointmentPayments(appointment.id),
      ]);

      setManagementData({
        appointment,
        documents,
        activities,
        payments,
      });
    } catch (error) {
      console.error('Failed to load appointment management data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    loadManagementData();
  };

  if (!appointment) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="flex-1">
            <DialogTitle className="text-xl font-semibold">
              Appointment Management
            </DialogTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={getStatusVariant(appointment.status)}>
                {getStatusLabel(appointment.status)}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Ref: {appointment.reference}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">DETAILS</TabsTrigger>
              <TabsTrigger value="track">TRACK</TabsTrigger>
              <TabsTrigger value="documents">DOCUMENTS</TabsTrigger>
              <TabsTrigger value="payment">PAYMENT</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto mt-4 px-1">
              <TabsContent value="details" className="mt-0 h-auto">
                <AppointmentDetailsTab
                  appointment={appointment}
                  isLoading={isLoading}
                  onSave={onSave}
                />
              </TabsContent>

              <TabsContent value="track" className="mt-0 h-auto">
                <AppointmentTrackTab
                  activities={managementData?.activities || []}
                  isLoading={isLoading}
                  onRefresh={refreshData}
                />
              </TabsContent>

              <TabsContent value="documents" className="mt-0 h-auto">
                <AppointmentDocumentsTab
                  documents={managementData?.documents || []}
                  appointmentId={appointment.id}
                  isLoading={isLoading}
                  onRefresh={refreshData}
                />
              </TabsContent>

              <TabsContent value="payment" className="mt-0 h-auto">
                <AppointmentPaymentTab
                  payments={managementData?.payments || []}
                  appointmentId={appointment.id}
                  isLoading={isLoading}
                  onRefresh={refreshData}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}