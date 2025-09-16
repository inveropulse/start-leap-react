import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Users,
  Calendar,
  Globe,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { SwipeableCard } from "@/shared/components/ui/SwipeableCard";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Clinic } from "../../../../../shared/types/domains/clinic/entities";
import { ClinicStatus } from "../../../../../shared/types/domains/clinic/enums";
import { cn } from "@/shared/utils/cn";

interface ClinicCardProps {
  clinic: Clinic;
  viewMode: "grid" | "list";
  onView: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ClinicCard({
  clinic,
  viewMode,
  onView,
  onEdit,
  onDelete,
}: ClinicCardProps) {
  const isMobile = useIsMobile();
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

  const handleExternalLink = (url?: string | null, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (url) {
      window.open(url.startsWith("http") ? url : `https://${url}`, "_blank");
    }
  };

  const handleEmail = (email?: string | null, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (email) {
      window.open(`mailto:${email}`, "_blank");
    }
  };

  const handlePhone = (phone?: string | null, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (phone) {
      window.open(`tel:${phone}`, "_blank");
    }
  };

  // Define swipe actions for mobile
  const swipeActions = isMobile
    ? [
        ...(onEdit
          ? [
              {
                id: "edit",
                label: "Edit",
                icon: Edit,
                color: "primary" as const,
                onAction: onEdit,
              },
            ]
          : []),
        ...(onDelete
          ? [
              {
                id: "delete",
                label: "Delete",
                icon: Trash2,
                color: "destructive" as const,
                onAction: onDelete,
              },
            ]
          : []),
      ]
    : [];

  if (viewMode === "list") {
    const cardContent = (
      <Card
        className="interactive cursor-pointer group hover:shadow-lg transition-all duration-200"
        onClick={onView}
      >
        <CardContent className="p-4 min-h-[80px] flex items-center">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg truncate">
                    {clinic.name}
                  </h3>
                  <Badge
                    variant="outline"
                    className={cn("text-xs", getStatusColor(clinic.status))}
                  >
                    {clinic.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {clinic.physicalAddress && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{clinic.city}</span>
                    </div>
                  )}
                  {clinic.contactPersonName && (
                    <span>Contact: {clinic.contactPersonName}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{clinic.doctorCount || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{clinic.activeAppointmentCount || 0}</span>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onView();
                    }}
                  >
                    View Details
                  </DropdownMenuItem>
                  {onEdit && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                      }}
                    >
                      Edit Clinic
                    </DropdownMenuItem>
                  )}
                  {clinic.emailAddress && (
                    <DropdownMenuItem
                      onClick={(e) => handleEmail(clinic.emailAddress, e)}
                    >
                      Send Email
                    </DropdownMenuItem>
                  )}
                  {clinic.phoneNumber && (
                    <DropdownMenuItem
                      onClick={(e) => handlePhone(clinic.phoneNumber, e)}
                    >
                      Call Clinic
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                      }}
                      className="text-destructive"
                    >
                      Delete Clinic
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    );

    return isMobile ? (
      <SwipeableCard rightActions={swipeActions}>{cardContent}</SwipeableCard>
    ) : (
      cardContent
    );
  }

  const gridCardContent = (
    <Card
      className="interactive cursor-pointer group hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
      onClick={onView}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{clinic.name}</h3>
              <p className="text-sm text-muted-foreground">{clinic.type}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn("text-xs", getStatusColor(clinic.status))}
            >
              {clinic.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onView();
                  }}
                >
                  View Details
                </DropdownMenuItem>
                {onEdit && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit();
                    }}
                  >
                    Edit Clinic
                  </DropdownMenuItem>
                )}
                {clinic.emailAddress && (
                  <DropdownMenuItem
                    onClick={(e) => handleEmail(clinic.emailAddress, e)}
                  >
                    Send Email
                  </DropdownMenuItem>
                )}
                {clinic.phoneNumber && (
                  <DropdownMenuItem
                    onClick={(e) => handlePhone(clinic.phoneNumber, e)}
                  >
                    Call Clinic
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                    className="text-destructive"
                  >
                    Delete Clinic
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contact Person */}
        {clinic.contactPersonName && (
          <div className="text-sm">
            <span className="text-muted-foreground">Contact: </span>
            <span className="font-medium">{clinic.contactPersonName}</span>
          </div>
        )}

        {/* Location */}
        {clinic.physicalAddress && (
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-foreground">{clinic.physicalAddress}</p>
              {clinic.city && (
                <p className="text-muted-foreground">
                  {clinic.city} {clinic.postalCode}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="space-y-2">
          {clinic.phoneNumber && (
            <div
              className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary"
              onClick={(e) => handlePhone(clinic.phoneNumber, e)}
            >
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{clinic.phoneNumber}</span>
            </div>
          )}

          {clinic.emailAddress && (
            <div
              className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary"
              onClick={(e) => handleEmail(clinic.emailAddress, e)}
            >
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{clinic.emailAddress}</span>
            </div>
          )}

          {clinic.website && (
            <div
              className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary"
              onClick={(e) => handleExternalLink(clinic.website, e)}
            >
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{clinic.website}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{clinic.doctorCount || 0} doctors</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{clinic.activeAppointmentCount || 0} appointments</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return isMobile ? (
    <SwipeableCard rightActions={swipeActions}>{gridCardContent}</SwipeableCard>
  ) : (
    gridCardContent
  );
}
