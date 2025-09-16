import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Phone, Mail, MapPin, Star, Calendar, Eye, Trash2 } from "lucide-react";
import { Sedationist } from "@/shared/types/domains/sedation";
import {
  SedationistAvatar,
  SedationistStatusBadge,
  SedationistSpecialtyBadge,
  sedationistUtils,
} from "../../shared";
import { DeleteSedationistDialog } from "../../delete";
import { useState } from "react";

export interface SedationistCardProps {
  sedationist: Sedationist;
  viewMode: "grid" | "list";
  onClick?: () => void;
}

export default function SedationistCard({
  sedationist,
  viewMode,
  onClick,
}: SedationistCardProps) {
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const fullName = sedationistUtils.getFullName(
    sedationist.firstName,
    sedationist.lastName
  );
  const formattedPhone = sedationistUtils.formatPhone(sedationist.phone);
  const formattedRating = sedationistUtils.formatRating(
    sedationist.rating || sedationist.patientRating || 0
  );
  const formattedExperience = sedationistUtils.formatExperience(
    sedationist.experience
  );

  if (viewMode === "list") {
    return (
      <>
        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          // onClick={onClick}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              {/* Avatar */}
              <SedationistAvatar
                firstName={sedationist.firstName}
                lastName={sedationist.lastName}
                profilePicture={sedationist.profileImageUrl}
                size="md"
              />

              {/* Basic Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-medium truncate">{fullName}</h3>
                  <SedationistStatusBadge status={sedationist.status} />
                </div>

                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  {sedationist.email && (
                    <div className="flex items-center space-x-1">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{sedationist.email}</span>
                    </div>
                  )}
                  {sedationist.phone && (
                    <div className="flex items-center space-x-1">
                      <Phone className="h-3 w-3" />
                      <span>{formattedPhone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-1 max-w-xs">
                {sedationist.specialties
                  ?.slice(0, 2)
                  .map((specialty, index) => (
                    <SedationistSpecialtyBadge
                      key={`${specialty}-${index}`}
                      specialty={specialty}
                    />
                  ))}
                {(sedationist.specialties?.length || 0) > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{(sedationist.specialties?.length || 0) - 2}
                  </Badge>
                )}
              </div>

              {/* Experience & Rating */}
              <div className="text-sm text-muted-foreground text-right">
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{formattedRating}</span>
                </div>
                <div className="flex items-center space-x-1 mt-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formattedExperience}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 ml-auto w-1/6 max-w-xs">
                <Button variant="outline" size="sm" onClick={onClick}>
                  <Eye className="h-2 w-2 mr-1" />
                  View
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-2 w-2 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <DeleteSedationistDialog
          sedationistId={sedationist.id}
          onDeleted={() => {
            setDeleteDialogOpen(false);
          }}
          isOpen={isDeleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        />
      </>
    );
  }

  // Grid view
  return (
    <>
      <Card
        className="hover:shadow-md transition-shadow cursor-pointer"
        // onClick={onClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <SedationistAvatar
              firstName={sedationist.firstName}
              lastName={sedationist.lastName}
              profilePicture={sedationist.profileImageUrl}
              size="md"
            />
            <SedationistStatusBadge status={sedationist.status} />
          </div>

          <div className="space-y-1">
            <h3 className="font-medium leading-tight">{fullName}</h3>
            <p className="text-sm text-muted-foreground">
              {sedationist.licenseNumber}
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-3">
          {/* Contact Info */}
          <div className="space-y-1 text-sm">
            {sedationist.email && (
              <div className="flex items-center space-x-2">
                <Mail className="h-3 w-3 text-muted-foreground" />
                <span className="truncate">{sedationist.email}</span>
              </div>
            )}
            {sedationist.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-3 w-3 text-muted-foreground" />
                <span>{formattedPhone}</span>
              </div>
            )}
          </div>

          {/* Specialties */}
          <div className="flex flex-wrap gap-1">
            {sedationist.specialties?.slice(0, 3).map((specialty, index) => (
              <SedationistSpecialtyBadge
                key={`${specialty}-${index}`}
                specialty={specialty}
                className="text-xs"
              />
            ))}
            {(sedationist.specialties?.length || 0) > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{(sedationist.specialties?.length || 0) - 3}
              </Badge>
            )}
          </div>

          {/* Stats */}
          <div className="flex justify-between text-sm">
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{formattedRating}</span>
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formattedExperience}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2 ml-auto w-1/2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={onClick}
            >
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={() => {
                setDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      <DeleteSedationistDialog
        sedationistId={sedationist.id}
        onDeleted={() => {
          setDeleteDialogOpen(false);
        }}
        isOpen={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </>
  );
}
