import React, { useState, useMemo, useCallback } from 'react';
import { Input } from '@/shared/components/ui';
import { Button } from '@/shared/components/ui/button';
import { PatientCard } from './PatientCard';
import { Patient } from '@/shared/types/domains/patient/entities';
import { Search, ChevronDown } from 'lucide-react';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { OptimizedList } from '@/shared/components/ui/OptimizedList';
import { usePerformanceMonitor } from '@/shared/hooks/usePerformanceMonitor';

interface VirtualPatientListProps {
  patients: Patient[];
  onPatientClick?: (patient: Patient) => void;
  onEditClick?: (patient: Patient) => void;
  onDeleteClick?: (patient: Patient) => void;
  isLoading?: boolean;
}

const ITEMS_PER_PAGE = 50; // Show 50 items at a time for performance

export function VirtualPatientList({
  patients,
  onPatientClick,
  onEditClick,
  onDeleteClick,
  isLoading = false,
}: VirtualPatientListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [useVirtualization, setUseVirtualization] = useState(patients.length > 100);
  const { startRender, endRender } = usePerformanceMonitor();

  const filteredPatients = useMemo(() => {
    startRender();
    
    if (!searchTerm.trim()) {
      endRender();
      return patients;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = patients.filter(patient =>
      patient.firstName?.toLowerCase().includes(term) ||
      patient.lastName?.toLowerCase().includes(term) ||
      patient.fullName?.toLowerCase().includes(term) ||
      patient.email?.toLowerCase().includes(term) ||
      patient.phoneNumber?.includes(term) ||
      patient.town?.toLowerCase().includes(term)
    );
    
    endRender();
    return filtered;
  }, [patients, searchTerm, startRender, endRender]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const renderPatientItem = useCallback((patient: Patient, index: number, style?: React.CSSProperties) => (
    <div style={style} key={patient.id}>
      <PatientCard
        patient={patient}
        viewMode="list"
        onView={onPatientClick ? () => onPatientClick(patient) : undefined}
        onEdit={onEditClick ? () => onEditClick(patient) : undefined}
        onDelete={onDeleteClick ? () => onDeleteClick(patient) : undefined}
      />
    </div>
  ), [onPatientClick, onEditClick, onDeleteClick]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-10 bg-muted rounded mb-4"></div>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded mb-2"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search patients by name, email, phone, or location..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>

      {/* Results Count & Performance Toggle */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredPatients.length} of {patients.length} patients
          {filteredPatients.length !== patients.length && ` (filtered)`}
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
        {patients.length > 100 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setUseVirtualization(!useVirtualization)}
            className="text-xs"
          >
            {useVirtualization ? "Disable" : "Enable"} Virtualization
          </Button>
        )}
      </div>

      {useVirtualization && filteredPatients.length > 50 ? (
        <OptimizedList
          items={filteredPatients}
          itemHeight={120}
          containerHeight={600}
          renderItem={renderPatientItem}
          className="border rounded-lg"
          overscan={3}
        />
      ) : (
        <div className="space-y-2">
          {filteredPatients.map((patient, index) => 
            renderPatientItem(patient, index, { display: "block" })
          )}
        </div>
      )}
    </div>
  );
}