import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Users, Plus, Mail, Phone, MoreVertical, Edit, Trash2 } from "lucide-react";
import { ClinicDoctor } from "../../types/clinic.types";
import { AddDoctorModal } from "../AddDoctorModal";
import { EditDoctorModal } from "../EditDoctorModal";

interface ClinicDoctorsTabProps {
  doctors: ClinicDoctor[];
  clinicId: string;
  isLoading: boolean;
  onUpdate: () => void;
}

export function ClinicDoctorsTab({ doctors, clinicId, isLoading, onUpdate }: ClinicDoctorsTabProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<ClinicDoctor | null>(null);

  const handleEditDoctor = (doctor: ClinicDoctor) => {
    setSelectedDoctor(doctor);
    setShowEditModal(true);
  };

  const handleDeleteDoctor = (doctor: ClinicDoctor) => {
    // Show confirmation dialog (simplified for now)
    if (confirm(`Are you sure you want to remove Dr. ${doctor.firstName} ${doctor.lastName} from this clinic?`)) {
      // Simulate delete operation
      console.log("Deleting doctor:", doctor.id);
      onUpdate();
    }
  };

  const handleContactDoctor = (doctor: ClinicDoctor, method: 'email' | 'phone') => {
    if (method === 'email' && doctor.email) {
      window.open(`mailto:${doctor.email}`, '_blank');
    } else if (method === 'phone' && doctor.phoneNumber) {
      window.open(`tel:${doctor.phoneNumber}`, '_blank');
    }
  };
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-muted h-24 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Doctors ({doctors.length})</h3>
        </div>
        <Button size="sm" onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Doctor
        </Button>
      </div>

      {doctors.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No doctors assigned to this clinic</p>
            <Button className="mt-4" size="sm" onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Doctor
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {doctors.map((doctor) => (
            <Card key={doctor.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{doctor.firstName} {doctor.lastName}</h4>
                      <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={doctor.status === 'Active' ? 'default' : 'secondary'}>
                      {doctor.status}
                    </Badge>
                    
                    <div className="flex gap-2">
                      {doctor.email && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleContactDoctor(doctor, 'email')}
                          title="Send Email"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      )}
                      {doctor.phoneNumber && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleContactDoctor(doctor, 'phone')}
                          title="Call Doctor"
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditDoctor(doctor)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Doctor
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteDoctor(doctor)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Doctor
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      <AddDoctorModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        clinicId={clinicId}
        onUpdate={onUpdate}
      />

      <EditDoctorModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        doctor={selectedDoctor}
        onUpdate={onUpdate}
      />
    </div>
  );
}