import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  User,
  Award,
  Calendar,
  FileText,
  Mail,
  Phone,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit3,
  Save,
  X,
} from "lucide-react";
import { useSedationistManagement } from "../hooks/useSedationistManagement";
import {
  SedationistStatus,
  CertificationStatus,
  SedationistSpecialty,
} from "@/shared/types/domains/sedation";

export interface SedationistManagementFormProps {
  sedationistId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusConfig = {
  [SedationistStatus.ACTIVE]: {
    label: "Active",
    variant: "default" as const,
    icon: CheckCircle,
    color: "text-green-600",
  },
  [SedationistStatus.INACTIVE]: {
    label: "Inactive",
    variant: "secondary" as const,
    icon: User,
    color: "text-gray-500",
  },
  [SedationistStatus.ON_LEAVE]: {
    label: "On Leave",
    variant: "outline" as const,
    icon: Calendar,
    color: "text-orange-500",
  },
  [SedationistStatus.IN_TRAINING]: {
    label: "Training",
    variant: "secondary" as const,
    icon: Clock,
    color: "text-blue-500",
  },
};

const specialtyLabels = {
  [SedationistSpecialty.GENERAL_ANAESTHESIA]: "General Anaesthesia",
  [SedationistSpecialty.CONSCIOUS_SEDATION]: "Conscious Sedation",
  [SedationistSpecialty.IV_SEDATION]: "IV Sedation",
  [SedationistSpecialty.NITROUS_OXIDE]: "Nitrous Oxide",
  [SedationistSpecialty.PEDIATRIC_SEDATION]: "Pediatric Sedation",
  [SedationistSpecialty.CARDIAC_SEDATION]: "Cardiac Sedation",
};

const certificationStatusConfig = {
  [CertificationStatus.VALID]: {
    label: "Valid",
    variant: "default" as const,
    color: "text-green-600",
  },
  [CertificationStatus.EXPIRING_SOON]: {
    label: "Expiring Soon",
    variant: "outline" as const,
    color: "text-orange-500",
  },
  [CertificationStatus.EXPIRED]: {
    label: "Expired",
    variant: "destructive" as const,
    color: "text-red-600",
  },
  [CertificationStatus.PENDING_RENEWAL]: {
    label: "Pending Renewal",
    variant: "secondary" as const,
    color: "text-blue-500",
  },
};

export default function SedationistManagementForm({
  sedationistId,
  isOpen,
  onClose,
}: SedationistManagementFormProps) {
  // Use extracted business logic hook
  const {
    sedationist,
    isLoading,
    error,
    activeTab,
    isEditing,
    editForm,
    isSaving,
    setActiveTab,
    toggleEdit,
    updateEditForm,
    handleSave,
    handleSpecialtyChange,
    handleStatusChange,
    resetForm,
  } = useSedationistManagement(sedationistId);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Error Loading Sedationist
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 text-center">
            <p className="text-muted-foreground">
              Failed to load sedationist details.
            </p>
            <Button variant="outline" onClick={handleClose} className="mt-4">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (isLoading || !sedationist) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Loading...</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const StatusIcon = statusConfig[sedationist.status].icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={sedationist.avatar} />
                <AvatarFallback>
                  {sedationist.firstName[0]}
                  {sedationist.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold">
                  {sedationist.firstName} {sedationist.lastName}
                </h2>
                <div className="flex items-center gap-2">
                  <StatusIcon
                    className={`h-4 w-4 ${
                      statusConfig[sedationist.status].color
                    }`}
                  />
                  <Badge variant={statusConfig[sedationist.status].variant}>
                    {statusConfig[sedationist.status].label}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button size="sm" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={toggleEdit}>
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button size="sm" onClick={toggleEdit}>
                  <Edit3 className="h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="specialties">Specialties</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </h3>

                <div className="space-y-3">
                  <div>
                    <Label>First Name</Label>
                    {isEditing ? (
                      <Input
                        value={editForm.firstName || ""}
                        onChange={(e) =>
                          updateEditForm({ firstName: e.target.value })
                        }
                      />
                    ) : (
                      <p className="font-medium">{sedationist.firstName}</p>
                    )}
                  </div>

                  <div>
                    <Label>Last Name</Label>
                    {isEditing ? (
                      <Input
                        value={editForm.lastName || ""}
                        onChange={(e) =>
                          updateEditForm({ lastName: e.target.value })
                        }
                      />
                    ) : (
                      <p className="font-medium">{sedationist.lastName}</p>
                    )}
                  </div>

                  <div>
                    <Label>Status</Label>
                    {isEditing ? (
                      <Select
                        value={editForm.status}
                        onValueChange={handleStatusChange}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(statusConfig).map(
                            ([status, config]) => (
                              <SelectItem key={status} value={status}>
                                <div className="flex items-center gap-2">
                                  <config.icon
                                    className={`h-4 w-4 ${config.color}`}
                                  />
                                  {config.label}
                                </div>
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center gap-2">
                        <StatusIcon
                          className={`h-4 w-4 ${
                            statusConfig[sedationist.status].color
                          }`}
                        />
                        <Badge
                          variant={statusConfig[sedationist.status].variant}
                        >
                          {statusConfig[sedationist.status].label}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Information
                </h3>

                <div className="space-y-3">
                  <div>
                    <Label>Email</Label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={editForm.email || ""}
                        onChange={(e) =>
                          updateEditForm({ email: e.target.value })
                        }
                      />
                    ) : (
                      <p className="font-medium">{sedationist.email}</p>
                    )}
                  </div>

                  <div>
                    <Label>Phone</Label>
                    {isEditing ? (
                      <Input
                        type="tel"
                        value={editForm.phone || ""}
                        onChange={(e) =>
                          updateEditForm({ phone: e.target.value })
                        }
                      />
                    ) : (
                      <p className="font-medium">
                        {sedationist.phone || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>License Number</Label>
                    {isEditing ? (
                      <Input
                        value={editForm.licenseNumber || ""}
                        onChange={(e) =>
                          updateEditForm({ licenseNumber: e.target.value })
                        }
                      />
                    ) : (
                      <p className="font-medium">{sedationist.licenseNumber}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5" />
                Performance Stats
              </h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {sedationist.totalProcedures}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Cases
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {sedationist.successRate}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Success Rate
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {sedationist.patientRating}/5
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Patient Rating
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {sedationist.experience || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Years Experience
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="specialties" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Award className="h-5 w-5" />
                Specialties
              </h3>
            </div>

            <div className="space-y-3">
              {Object.entries(specialtyLabels).map(([specialty, label]) => {
                const isSelected = isEditing
                  ? editForm.specialties?.includes(
                      specialty as SedationistSpecialty
                    )
                  : sedationist.specialties.includes(
                      specialty as SedationistSpecialty
                    );

                return (
                  <div
                    key={specialty}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <span className="font-medium">{label}</span>
                    {isEditing ? (
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          handleSpecialtyChange(
                            specialty as SedationistSpecialty,
                            Boolean(checked)
                          )
                        }
                      />
                    ) : (
                      isSelected && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="certifications" className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Award className="h-5 w-5" />
              Certifications
            </h3>

            <div className="space-y-3">
              {sedationist.certifications.map((cert, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-semibold">{cert.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {cert.issuingBody} • {cert.certificateNumber}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Issued: {new Date(cert.issueDate).toLocaleDateString()}{" "}
                        • Expires:{" "}
                        {new Date(cert.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant={certificationStatusConfig[cert.status].variant}
                    >
                      {certificationStatusConfig[cert.status].label}
                    </Badge>
                  </div>
                </div>
              ))}

              {sedationist.certifications.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No certifications on file
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="availability" className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Availability
            </h3>

            <div className="space-y-3">
              {sedationist.availability.map((avail, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{avail.dayOfWeek}</p>
                      <p className="text-sm text-muted-foreground">
                        {avail.startTime} - {avail.endTime}
                      </p>
                    </div>
                    <Badge
                      variant={avail.isAvailable ? "default" : "secondary"}
                    >
                      {avail.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                  </div>
                </div>
              ))}

              {sedationist.availability.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No availability schedule set
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
