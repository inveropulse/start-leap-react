import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Building2, MapPin, Phone, Mail, Globe } from "lucide-react";
import { Clinic, ClinicStatus } from "../../types/clinic.types";
import { cn } from "@/shared/utils/cn";

interface ClinicDetailsTabProps {
  clinic?: Clinic;
  isLoading: boolean;
  onUpdate: () => void;
}

export function ClinicDetailsTab({ clinic, isLoading, onUpdate }: ClinicDetailsTabProps) {
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-muted h-32 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (!clinic) {
    return <div className="text-center text-muted-foreground py-8">No clinic data available</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Clinic Name</label>
              <p className="text-sm font-medium">{clinic.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                <Badge variant="outline" className={cn("text-xs", getStatusColor(clinic.status))}>
                  {clinic.status}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Contact Person</label>
              <p className="text-sm">{clinic.contactPersonName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Type</label>
              <p className="text-sm">{clinic.type}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Address Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Address</label>
            <p className="text-sm">{clinic.physicalAddress}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">City</label>
              <p className="text-sm">{clinic.city}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Postal Code</label>
              <p className="text-sm">{clinic.postalCode}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <p className="text-sm">{clinic.phoneNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-sm">{clinic.emailAddress}</p>
              </div>
            </div>
          </div>
          {clinic.website && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <div>
                <label className="text-sm font-medium text-muted-foreground">Website</label>
                <p className="text-sm">{clinic.website}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}