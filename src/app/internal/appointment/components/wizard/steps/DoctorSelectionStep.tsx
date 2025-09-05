import { useState, useEffect, useCallback } from 'react';
import { User, Star, Award } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/components/ui/avatar';
import { WizardStepProps } from '../../../types/wizard.types';
import { getDoctorsByClinic } from '../../../data/mockWizardData';

export function DoctorSelectionStep({ data, onDataChange, onNext, onPrevious }: WizardStepProps) {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(data.doctor?.id || '');

  // Load doctors for selected clinic
  useEffect(() => {
    if (data.clinic?.id) {
      const clinicDoctors = getDoctorsByClinic(data.clinic.id);
      setDoctors(clinicDoctors);
    }
  }, [data.clinic?.id]);

  const handleDoctorSelect = useCallback((doctor: any) => {
    setSelectedDoctorId(doctor.id);
    onDataChange({ doctor });
  }, [onDataChange]);

  const handleNext = useCallback(() => {
    if (selectedDoctorId) {
      onNext();
    }
  }, [selectedDoctorId, onNext]);

  if (!data.clinic) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Please select a clinic first.</p>
        <Button variant="outline" onClick={onPrevious} className="mt-4">
          Go Back to Clinic Selection
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Select Doctor</h2>
        <p className="text-muted-foreground">
          Choose a doctor from <span className="font-medium">{data.clinic.name}</span>
        </p>
      </div>

      {/* Doctors List */}
      {doctors.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No doctors available at this clinic.</p>
          <Button variant="outline" onClick={onPrevious}>
            Select Different Clinic
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {doctors.map((doctor) => (
            <Card
              key={doctor.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedDoctorId === doctor.id
                  ? 'ring-2 ring-portal-internal-primary bg-portal-internal-secondary'
                  : 'hover:ring-1 hover:ring-border'
              }`}
              onClick={() => handleDoctorSelect(doctor)}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={doctor.avatar} alt={`${doctor.firstName} ${doctor.lastName}`} />
                    <AvatarFallback>
                      <User className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-lg text-foreground truncate">
                        {doctor.firstName} {doctor.lastName}
                      </h3>
                      {selectedDoctorId === doctor.id && (
                        <Badge className="bg-portal-internal-primary text-white ml-2">
                          Selected
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-portal-internal-primary font-medium">
                        {doctor.specialization}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Award className="h-4 w-4 mr-1" />
                          <span>{doctor.experience} years exp.</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 fill-current text-yellow-500" />
                          <span>{doctor.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {doctor.credentials.map((credential: string) => (
                          <Badge key={credential} variant="outline" className="text-xs">
                            {credential}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={!selectedDoctorId}
          className="bg-portal-internal-primary hover:bg-portal-internal-primary/90"
        >
          Continue to Sedationist Selection
        </Button>
      </div>
    </div>
  );
}