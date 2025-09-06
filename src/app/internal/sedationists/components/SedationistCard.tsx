import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { 
  UserCheck, 
  Mail, 
  Phone, 
  Award, 
  Clock, 
  Star,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Eye
} from "lucide-react";
import { 
  Sedationist, 
  SedationistStatus, 
  CertificationStatus,
  SedationistSpecialty 
} from '../types';

interface SedationistCardProps {
  sedationist: Sedationist;
  viewMode: 'grid' | 'list';
  onClick: () => void;
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
    icon: UserCheck,
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
  [SedationistSpecialty.PEDIATRIC_SEDATION]: 'Pediatric',
  [SedationistSpecialty.CARDIAC_SEDATION]: 'Cardiac',
};

export function SedationistCard({ sedationist, viewMode, onClick }: SedationistCardProps) {
  const fullName = `${sedationist.firstName} ${sedationist.lastName}`;
  const initials = `${sedationist.firstName[0]}${sedationist.lastName[0]}`.toUpperCase();
  const statusInfo = statusConfig[sedationist.status];
  const StatusIcon = statusInfo.icon;

  // Check for expiring certifications
  const hasExpiringCerts = sedationist.certifications.some(
    cert => cert.status === CertificationStatus.EXPIRING_SOON
  );
  const hasExpiredCerts = sedationist.certifications.some(
    cert => cert.status === CertificationStatus.EXPIRED
  );

  const certificationAlert = hasExpiredCerts ? 'expired' : hasExpiringCerts ? 'expiring' : null;

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={sedationist.profileImageUrl} alt={fullName} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold truncate">{fullName}</h3>
                  <Badge variant={statusInfo.variant} className="shrink-0">
                    <StatusIcon className={`h-3 w-3 mr-1 ${statusInfo.color}`} />
                    {statusInfo.label}
                  </Badge>
                  {certificationAlert && (
                    <Badge variant={certificationAlert === 'expired' ? 'destructive' : 'outline'}>
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {certificationAlert === 'expired' ? 'Cert Expired' : 'Cert Expiring'}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{sedationist.licenseNumber}</p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                  <div className="flex items-center space-x-1">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{sedationist.email}</span>
                  </div>
                  {sedationist.phone && (
                    <div className="flex items-center space-x-1">
                      <Phone className="h-3 w-3" />
                      <span>{sedationist.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <div className="text-center">
                <div className="font-semibold">{sedationist.totalProcedures}</div>
                <div className="text-muted-foreground">Cases</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{sedationist.successRate.toFixed(1)}%</div>
                <div className="text-muted-foreground">Success</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="font-semibold">{sedationist.patientRating.toFixed(1)}</span>
                </div>
                <div className="text-muted-foreground">Rating</div>
              </div>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
            </div>
          </div>

          {/* Specialties */}
          <div className="flex flex-wrap gap-1 mt-3">
            {sedationist.specialties.slice(0, 3).map((specialty) => (
              <Badge key={specialty} variant="outline" className="text-xs">
                {specialtyLabels[specialty]}
              </Badge>
            ))}
            {sedationist.specialties.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{sedationist.specialties.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={sedationist.profileImageUrl} alt={fullName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{fullName}</CardTitle>
              <p className="text-sm text-muted-foreground">{sedationist.licenseNumber}</p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <Badge variant={statusInfo.variant}>
              <StatusIcon className={`h-3 w-3 mr-1 ${statusInfo.color}`} />
              {statusInfo.label}
            </Badge>
            {certificationAlert && (
              <Badge variant={certificationAlert === 'expired' ? 'destructive' : 'outline'}>
                <AlertTriangle className="h-3 w-3 mr-1" />
                {certificationAlert === 'expired' ? 'Expired' : 'Expiring'}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Contact */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{sedationist.email}</span>
          </div>
          {sedationist.phone && (
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{sedationist.phone}</span>
            </div>
          )}
        </div>

        {/* Specialties */}
        <div>
          <h4 className="text-sm font-medium mb-2">Specialties</h4>
          <div className="flex flex-wrap gap-1">
            {sedationist.specialties.slice(0, 2).map((specialty) => (
              <Badge key={specialty} variant="outline" className="text-xs">
                {specialtyLabels[specialty]}
              </Badge>
            ))}
            {sedationist.specialties.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{sedationist.specialties.length - 2}
              </Badge>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="font-semibold text-lg">{sedationist.totalProcedures}</div>
            <div className="text-xs text-muted-foreground">Total Cases</div>
          </div>
          <div>
            <div className="font-semibold text-lg">{sedationist.successRate.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">Success Rate</div>
          </div>
          <div>
            <div className="flex items-center justify-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="font-semibold text-lg">{sedationist.patientRating.toFixed(1)}</span>
            </div>
            <div className="text-xs text-muted-foreground">Patient Rating</div>
          </div>
        </div>

        {/* Certifications Count */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <Award className="h-4 w-4 text-muted-foreground" />
            <span>{sedationist.certifications.length} Certifications</span>
          </div>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}