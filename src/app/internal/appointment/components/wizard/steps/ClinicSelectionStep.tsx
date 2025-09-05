import { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Phone, Star } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { WizardStepProps } from '../../../types/wizard.types';
import { searchClinics } from '../../../data/mockWizardData';

export function ClinicSelectionStep({ data, onDataChange, onNext, onPrevious }: WizardStepProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState(searchClinics('', 1, 6));
  const [selectedClinicId, setSelectedClinicId] = useState(data.clinic?.id || '');

  // Search clinics with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      const results = searchClinics(searchQuery, currentPage, 6);
      setSearchResults(results);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, currentPage]);

  const handleClinicSelect = useCallback((clinic: any) => {
    setSelectedClinicId(clinic.id);
    // Clear doctor selection when clinic changes
    onDataChange({ clinic, doctor: undefined });
  }, [onDataChange]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handleNext = useCallback(() => {
    if (selectedClinicId) {
      onNext();
    }
  }, [selectedClinicId, onNext]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Select Clinic</h2>
        <p className="text-muted-foreground">Choose a clinic for the appointment</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search clinics by name, location, or specialty..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Clinic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {searchResults.data.map((clinic) => (
          <Card
            key={clinic.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedClinicId === clinic.id
                ? 'ring-2 ring-portal-internal-primary bg-portal-internal-secondary'
                : 'hover:ring-1 hover:ring-border'
            }`}
            onClick={() => handleClinicSelect(clinic)}
          >
            <CardContent className="p-0">
              {/* Clinic Image */}
              <div className="h-48 bg-gradient-to-br from-portal-internal-primary/10 to-portal-internal-accent/10 rounded-t-lg relative overflow-hidden">
                {clinic.image && (
                  <img
                    src={clinic.image}
                    alt={clinic.name}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-white/90 text-foreground">
                    <Star className="h-3 w-3 mr-1 fill-current text-yellow-500" />
                    {clinic.rating}
                  </Badge>
                </div>
                {selectedClinicId === clinic.id && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-portal-internal-primary text-white">
                      Selected
                    </Badge>
                  </div>
                )}
              </div>
              
              {/* Clinic Info */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-1">
                    {clinic.name}
                  </h3>
                  
                  <div className="flex items-start text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1 mt-0.5 shrink-0" />
                    <span className="line-clamp-2">{clinic.address}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 mr-1" />
                    <span>{clinic.phone}</span>
                  </div>
                </div>
                
                {/* Specialties */}
                <div>
                  <div className="text-sm font-medium text-foreground mb-2">Specialties:</div>
                  <div className="flex flex-wrap gap-1">
                    {clinic.specialties.slice(0, 3).map((specialty) => (
                      <Badge key={specialty} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {clinic.specialties.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{clinic.specialties.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
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
        Showing {searchResults.data.length} of {searchResults.total} clinics
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={!selectedClinicId}
          className="bg-portal-internal-primary hover:bg-portal-internal-primary/90"
        >
          Continue to Doctor Selection
        </Button>
      </div>
    </div>
  );
}