import { memo } from "react";
import { MoreHorizontal, Phone, Mail, MapPin, Eye, Edit, Trash2, Calendar } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { SwipeableCard } from "@/shared/components/ui/SwipeableCard";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { useKeyboardNavigation } from "@/shared/hooks/useKeyboardNavigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";
import { Patient } from "../types/patient.types";
import { PatientAvatar } from "./PatientAvatar";

interface PatientCardProps {
  patient: Patient;
  viewMode: 'grid' | 'list';
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const PatientCard = memo(function PatientCard({
  patient,
  viewMode,
  onView,
  onEdit,
  onDelete,
}: PatientCardProps) {
  const isMobile = useIsMobile();
  
  const { handleKeyDown } = useKeyboardNavigation({
    onEnter: onView,
    enabled: true,
  });
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getLastVisit = () => {
    // Mock last visit - in real app this would come from appointments
    const randomDays = Math.floor(Math.random() * 90);
    const lastVisit = new Date();
    lastVisit.setDate(lastVisit.getDate() - randomDays);
    return formatDate(lastVisit.toISOString());
  };

  // Define swipe actions for mobile
  const swipeActions = isMobile ? [
    {
      id: 'edit',
      label: 'Edit',
      icon: Edit,
      color: 'primary' as const,
      onAction: onEdit,
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      color: 'destructive' as const,
      onAction: onDelete,
    },
  ] : [];

  if (viewMode === 'list') {
    const cardContent = (
      <Card 
        className="interactive hover:shadow-lg transition-all duration-200 group"
        role="article"
        aria-labelledby={`patient-${patient.id}-name`}
        tabIndex={0}
        onKeyDown={(e) => handleKeyDown(e.nativeEvent)}
      >
        <CardContent className="p-4 min-h-[80px] flex items-center">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <PatientAvatar patient={patient} size="lg" />
              
              <div className="flex-1 min-w-0">
                 <div className="flex items-center gap-2 mb-1">
                   <h3 
                     id={`patient-${patient.id}-name`}
                     className="font-semibold truncate"
                   >
                     {patient.fullName}
                   </h3>
                  {patient.age && (
                    <Badge variant="secondary" className="text-xs">
                      {patient.age}y
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                  {patient.phoneNumber && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span className="truncate">{patient.phoneNumber}</span>
                    </div>
                  )}
                  {patient.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{patient.email}</span>
                    </div>
                  )}
                  {patient.town && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{patient.town}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden lg:flex flex-col text-right text-xs text-muted-foreground">
                <span>Last visit:</span>
                <span>{getLastVisit()}</span>
              </div>
              
               <DropdownMenu>
                 <DropdownMenuTrigger asChild>
                   <Button 
                     variant="ghost" 
                     size="sm"
                     aria-label={`Actions for ${patient.fullName}`}
                   >
                     <MoreHorizontal className="h-4 w-4" />
                   </Button>
                 </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onView}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Patient
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onDelete} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Patient
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    );

    return isMobile ? (
      <SwipeableCard rightActions={swipeActions}>
        {cardContent}
      </SwipeableCard>
    ) : cardContent;
  }

  const gridCardContent = (
    <Card 
      className="interactive cursor-pointer group hover:shadow-lg hover:-translate-y-1 transition-all duration-200" 
      onClick={onView}
      role="article"
      aria-labelledby={`patient-${patient.id}-grid-name`}
      tabIndex={0}
      onKeyDown={(e) => handleKeyDown(e.nativeEvent)}
    >
      <CardContent className="p-4 min-h-[200px]">
        <div className="flex flex-col space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <PatientAvatar patient={patient} size="md" />
              <div className="flex-1 min-w-0">
                 <h3 
                   id={`patient-${patient.id}-grid-name`}
                   className="font-semibold truncate group-hover:text-primary transition-colors"
                 >
                   {patient.fullName}
                 </h3>
                <div className="flex items-center gap-2 mt-1">
                  {patient.age && (
                    <Badge variant="secondary" className="text-xs">
                      {patient.age} years old
                    </Badge>
                  )}
                  {patient.sex && (
                    <Badge variant="outline" className="text-xs">
                      {patient.sex}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
             <DropdownMenu>
               <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                 <Button 
                   variant="ghost" 
                   size="sm" 
                   className="opacity-0 group-hover:opacity-100 transition-opacity"
                   aria-label={`Actions for ${patient.fullName}`}
                 >
                   <MoreHorizontal className="h-4 w-4" />
                 </Button>
               </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView(); }}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Patient
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={(e) => { e.stopPropagation(); onDelete(); }} 
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Patient
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Contact Info */}
          <div className="space-y-2 text-sm text-muted-foreground">
            {patient.phoneNumber && (
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{patient.phoneNumber}</span>
              </div>
            )}
            {patient.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{patient.email}</span>
              </div>
            )}
            {patient.town && (
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{patient.town}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-2 border-t flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Last: {getLastVisit()}</span>
            </div>
            {patient.bmi && (
              <Badge variant="outline" className="text-xs">
                BMI: {patient.bmi}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return isMobile ? (
    <SwipeableCard rightActions={swipeActions}>
      {gridCardContent}
    </SwipeableCard>
  ) : gridCardContent;
});