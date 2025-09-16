import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Badge } from "@/shared/components/ui/badge";
import { Building2, X, RefreshCw } from "lucide-react";
import { useClinicManagement } from "./useClinicManagement";
import { ClinicDetailsTab } from "../shared/components/tabs/ClinicDetailsTab";
import { ClinicDoctorsTab } from "../shared/components/tabs/ClinicDoctorsTab";
import { ClinicUsersTab } from "../shared/components/tabs/ClinicUsersTab";
import { ClinicActivityTab } from "../shared/components/tabs/ClinicActivityTab";
import { ClinicStatus } from "../../../../shared/types/domains/clinic/enums";
import { cn } from "@/shared/utils/cn";

interface ClinicManagementModalProps {
  clinicId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ClinicManagementModal({
  clinicId,
  isOpen,
  onClose,
}: ClinicManagementModalProps) {
  const {
    // Data
    clinic,
    doctors,
    users,
    activities,

    // Loading states
    isLoading,
    error,

    // Actions
    handleRefresh,
  } = useClinicManagement({
    clinicId,
  });

  const getStatusColor = (status?: ClinicStatus) => {
    switch (status) {
      case ClinicStatus.ACTIVE:
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case ClinicStatus.INACTIVE:
        return "bg-red-100 text-red-800 border-red-200";
      case ClinicStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (!isOpen || !clinicId) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="flex-1">
            <DialogTitle className="text-xl font-semibold">
              {isLoading ? (
                <div className="animate-pulse bg-muted h-6 w-64 rounded"></div>
              ) : (
                <div className="flex items-center gap-3">
                  <Building2 className="h-6 w-6 text-primary" />
                  <span>{clinic?.name || "Clinic Details"}</span>
                  {clinic?.status && (
                    <Badge
                      variant="outline"
                      className={cn("text-xs", getStatusColor(clinic.status))}
                    >
                      {clinic.status}
                    </Badge>
                  )}
                </div>
              )}
            </DialogTitle>
            {clinic?.contactPersonName && (
              <p className="text-sm text-muted-foreground mt-1">
                Contact: {clinic.contactPersonName}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </Button>
            <Button variant="outline" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {error && (
          <div className="text-center py-8">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={handleRefresh} variant="outline">
              Try Again
            </Button>
          </div>
        )}

        {(isLoading || clinic) && (
          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="details" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">DETAILS</TabsTrigger>
                <TabsTrigger value="doctors">
                  DOCTORS ({doctors.length})
                </TabsTrigger>
                <TabsTrigger value="users">USERS ({users.length})</TabsTrigger>
                <TabsTrigger value="activity">ACTIVITY</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-auto mt-4 px-1">
                <TabsContent value="details" className="mt-0 h-auto">
                  <ClinicDetailsTab
                    clinic={clinic}
                    isLoading={isLoading}
                    onUpdate={handleRefresh}
                  />
                </TabsContent>

                <TabsContent value="doctors" className="mt-0 h-auto">
                  <ClinicDoctorsTab
                    doctors={doctors}
                    clinicId={clinicId}
                    isLoading={isLoading}
                    onUpdate={handleRefresh}
                  />
                </TabsContent>

                <TabsContent value="users" className="mt-0 h-auto">
                  <ClinicUsersTab
                    users={users}
                    clinicId={clinicId}
                    isLoading={isLoading}
                    onUpdate={handleRefresh}
                  />
                </TabsContent>

                <TabsContent value="activity" className="mt-0 h-auto">
                  <ClinicActivityTab
                    activities={activities}
                    isLoading={isLoading}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
