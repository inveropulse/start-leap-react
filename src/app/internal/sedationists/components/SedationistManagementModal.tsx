import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { 
  User, 
  Award, 
  Calendar, 
  FileText, 
  StickyNote,
  Mail,
  Phone,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { useSedationistRequest } from '../hooks/useSedationistsRequest';
import { 
  SedationistStatus, 
  CertificationStatus,
  SedationistSpecialty 
} from '../types';

interface SedationistManagementModalProps {
  sedationistId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusConfig = {
  [SedationistStatus.ACTIVE]: {
    label: 'Active',
    variant: 'default' as const,
    icon: CheckCircle,
    color: 'text-green-600',
  },
  [SedationistStatus.INACTIVE]: {
    label: 'Inactive',
    variant: 'secondary' as const,
    icon: User,
    color: 'text-gray-500',
  },
  [SedationistStatus.ON_LEAVE]: {
    label: 'On Leave',
    variant: 'outline' as const,
    icon: Calendar,
    color: 'text-orange-500',
  },
  [SedationistStatus.IN_TRAINING]: {
    label: 'Training',
    variant: 'secondary' as const,
    icon: Clock,
    color: 'text-blue-500',
  },
};

const specialtyLabels = {
  [SedationistSpecialty.GENERAL_ANAESTHESIA]: 'General Anaesthesia',
  [SedationistSpecialty.CONSCIOUS_SEDATION]: 'Conscious Sedation',
  [SedationistSpecialty.IV_SEDATION]: 'IV Sedation',
  [SedationistSpecialty.NITROUS_OXIDE]: 'Nitrous Oxide',
  [SedationistSpecialty.PEDIATRIC_SEDATION]: 'Pediatric Sedation',
  [SedationistSpecialty.CARDIAC_SEDATION]: 'Cardiac Sedation',
};

const certificationStatusConfig = {
  [CertificationStatus.VALID]: {
    label: 'Valid',
    variant: 'default' as const,
    color: 'text-green-600',
  },
  [CertificationStatus.EXPIRING_SOON]: {
    label: 'Expiring Soon',
    variant: 'outline' as const,
    color: 'text-orange-500',
  },
  [CertificationStatus.EXPIRED]: {
    label: 'Expired',
    variant: 'destructive' as const,
    color: 'text-red-600',
  },
  [CertificationStatus.PENDING_RENEWAL]: {
    label: 'Pending Renewal',
    variant: 'secondary' as const,
    color: 'text-blue-500',
  },
};

export function SedationistManagementModal({ 
  sedationistId, 
  isOpen, 
  onClose 
}: SedationistManagementModalProps) {
  const [activeTab, setActiveTab] = useState('profile');
  
  const { data: sedationist, isLoading, error } = useSedationistRequest(sedationistId);

  if (!isOpen || !sedationistId) return null;

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center h-40">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading sedationist details...</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !sedationist) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center h-40">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Error Loading Sedationist</h3>
              <p className="text-muted-foreground mb-4">
                Unable to load sedationist details. Please try again.
              </p>
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const fullName = `${sedationist.firstName} ${sedationist.lastName}`;
  const initials = `${sedationist.firstName[0]}${sedationist.lastName[0]}`.toUpperCase();
  const statusInfo = statusConfig[sedationist.status];
  const StatusIcon = statusInfo.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={sedationist.profileImageUrl} alt={fullName} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-2xl">{fullName}</DialogTitle>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant={statusInfo.variant}>
                  <StatusIcon className={`h-3 w-3 mr-1 ${statusInfo.color}`} />
                  {statusInfo.label}
                </Badge>
                <span className="text-muted-foreground">{sedationist.licenseNumber}</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="certifications">
              <Award className="h-4 w-4 mr-2" />
              Certifications
            </TabsTrigger>
            <TabsTrigger value="availability">
              <Calendar className="h-4 w-4 mr-2" />
              Availability
            </TabsTrigger>
            <TabsTrigger value="cases">
              <FileText className="h-4 w-4 mr-2" />
              Cases
            </TabsTrigger>
            <TabsTrigger value="notes">
              <StickyNote className="h-4 w-4 mr-2" />
              Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{sedationist.email}</span>
                  </div>
                  {sedationist.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{sedationist.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Professional Stats */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Professional Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{sedationist.totalProcedures}</div>
                    <div className="text-sm text-muted-foreground">Total Cases</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{sedationist.successRate.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{sedationist.patientRating.toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground">Patient Rating</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{sedationist.certifications.length}</div>
                    <div className="text-sm text-muted-foreground">Certifications</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Specialties */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {sedationist.specialties.map((specialty) => (
                  <Badge key={specialty} variant="outline">
                    {specialtyLabels[specialty]}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Service Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Service Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium">Joined:</span>
                  <span className="ml-2">{new Date(sedationist.joinDate).toLocaleDateString()}</span>
                </div>
                {sedationist.lastActiveDate && (
                  <div>
                    <span className="text-sm font-medium">Last Active:</span>
                    <span className="ml-2">{new Date(sedationist.lastActiveDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="certifications" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Certifications & Licenses</h3>
              <Button variant="outline" size="sm">
                Add Certification
              </Button>
            </div>
            
            <div className="space-y-4">
              {sedationist.certifications.map((cert) => {
                const certStatusInfo = certificationStatusConfig[cert.status];
                return (
                  <div key={cert.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{cert.name}</h4>
                        <p className="text-sm text-muted-foreground">{cert.issuingBody}</p>
                        <p className="text-sm text-muted-foreground">
                          Certificate #: {cert.certificateNumber}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-sm">
                          <span>Issued: {new Date(cert.issueDate).toLocaleDateString()}</span>
                          <span>Expires: {new Date(cert.expiryDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Badge variant={certStatusInfo.variant}>
                        {certStatusInfo.label}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="availability" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Schedule & Availability</h3>
              <Button variant="outline" size="sm">
                Edit Schedule
              </Button>
            </div>
            
            {sedationist.availability.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-medium mb-2">No schedule set</h4>
                <p className="text-muted-foreground mb-4">
                  This sedationist hasn't set their availability yet.
                </p>
                <Button variant="outline">
                  Set Availability
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {sedationist.availability.map((slot) => {
                  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                  return (
                    <div key={slot.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">{days[slot.dayOfWeek]}</span>
                      <span>{slot.startTime} - {slot.endTime}</span>
                      <Badge variant={slot.isAvailable ? 'default' : 'secondary'}>
                        {slot.isAvailable ? 'Available' : 'Unavailable'}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="cases" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent Cases</h3>
              <Button variant="outline" size="sm">
                View All Cases
              </Button>
            </div>
            
            {sedationist.recentCases.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-medium mb-2">No recent cases</h4>
                <p className="text-muted-foreground">
                  No cases have been recorded for this sedationist yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sedationist.recentCases.map((case_) => (
                  <div key={case_.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{case_.procedureType}</h4>
                        <p className="text-sm text-muted-foreground">Patient: {case_.patientName}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm">
                          <span>Date: {new Date(case_.procedureDate).toLocaleDateString()}</span>
                          <span>Duration: {case_.duration} mins</span>
                        </div>
                        {case_.notes && (
                          <p className="text-sm text-muted-foreground mt-2">{case_.notes}</p>
                        )}
                      </div>
                      <Badge variant="default">
                        {case_.outcome}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Administrative Notes</h3>
              <Button variant="outline" size="sm">
                Add Note
              </Button>
            </div>
            
            {sedationist.notes ? (
              <div className="p-4 border rounded-lg">
                <p>{sedationist.notes}</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <StickyNote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-medium mb-2">No notes</h4>
                <p className="text-muted-foreground mb-4">
                  No administrative notes have been added for this sedationist.
                </p>
                <Button variant="outline">
                  Add First Note
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}