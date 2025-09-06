import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Users, Plus, Mail, Phone } from "lucide-react";
import { ClinicDoctor } from "../../types/clinic.types";

interface ClinicDoctorsTabProps {
  doctors: ClinicDoctor[];
  clinicId: string;
  isLoading: boolean;
  onUpdate: () => void;
}

export function ClinicDoctorsTab({ doctors, clinicId, isLoading, onUpdate }: ClinicDoctorsTabProps) {
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
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Doctor
        </Button>
      </div>

      {doctors.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No doctors assigned to this clinic</p>
            <Button className="mt-4" size="sm">
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
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                      )}
                      {doctor.phoneNumber && (
                        <Button variant="ghost" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}