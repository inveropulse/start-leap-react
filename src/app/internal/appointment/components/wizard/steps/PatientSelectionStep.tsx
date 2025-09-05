import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, User } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/components/ui/avatar';
import { WizardStepProps } from '../../../types/wizard.types';
import { searchPatients } from '../../../data/mockWizardData';

export function PatientSelectionStep({ data, onDataChange, onNext }: WizardStepProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState(searchPatients('', 1, 8));
  const [selectedPatientId, setSelectedPatientId] = useState(data.patient?.id || '');

  // Search patients with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      const results = searchPatients(searchQuery, currentPage, 8);
      setSearchResults(results);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, currentPage]);

  const handlePatientSelect = useCallback((patient: any) => {
    setSelectedPatientId(patient.id);
    onDataChange({ patient });
  }, [onDataChange]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handleNext = useCallback(() => {
    if (selectedPatientId && data.patient) {
      onNext();
    }
  }, [selectedPatientId, onNext, data.patient]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Select Patient</h2>
        <p className="text-muted-foreground">Choose a patient for this appointment</p>
      </div>

      {/* Search and Add Patient */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Add New Patient
        </Button>
      </div>

      {/* Patient Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {searchResults.data.map((patient) => (
          <Card
            key={patient.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedPatientId === patient.id
                ? 'ring-2 ring-portal-internal-primary bg-portal-internal-secondary'
                : 'hover:ring-1 hover:ring-border'
            }`}
            onClick={() => handlePatientSelect(patient)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={patient.avatar} alt={`${patient.firstName} ${patient.lastName}`} />
                  <AvatarFallback>
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    {patient.firstName} {patient.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {patient.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {patient.phone}
                  </p>
                </div>
              </div>
              
              {selectedPatientId === patient.id && (
                <div className="mt-3">
                  <Badge variant="secondary" className="bg-portal-internal-primary text-white">
                    Selected
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {searchResults.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, searchResults.totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-10"
                >
                  {page}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(searchResults.totalPages, prev + 1))}
            disabled={currentPage === searchResults.totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Results Info */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {searchResults.data.length} of {searchResults.total} patients
      </div>

      {/* Next Button */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={handleNext}
          disabled={!selectedPatientId}
          className="bg-portal-internal-primary hover:bg-portal-internal-primary/90"
        >
          Continue to Clinic Selection
        </Button>
      </div>
    </div>
  );
}