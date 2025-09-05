import { useMemo, useState, useCallback } from "react";
import { Patient } from "../types/patient.types";
import { PatientCard } from "./PatientCard";
import { Input } from "@/shared/components/ui/input";
import { Search } from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

  // Filter patients based on search term
  const filteredPatients = useMemo(() => {
    if (!searchTerm.trim()) return patients;
    
    const search = searchTerm.toLowerCase();
    return patients.filter(patient =>
      patient.firstName?.toLowerCase().includes(search) ||
      patient.lastName?.toLowerCase().includes(search) ||
      patient.fullName?.toLowerCase().includes(search) ||
      patient.email?.toLowerCase().includes(search) ||
      patient.phoneNumber?.includes(search) ||
      patient.town?.toLowerCase().includes(search)
    );
  }, [patients, searchTerm]);

  // Show only the first N items for performance
  const displayedPatients = filteredPatients.slice(0, displayCount);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setDisplayCount(ITEMS_PER_PAGE); // Reset display count on search
  }, []);

  const handleLoadMore = useCallback(() => {
    setDisplayCount(prev => prev + ITEMS_PER_PAGE);
  }, []);

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

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {displayedPatients.length} of {filteredPatients.length} patients
        {filteredPatients.length !== patients.length && ` (filtered from ${patients.length})`}
        {searchTerm && ` matching "${searchTerm}"`}
      </div>

      {/* Patient List */}
      {filteredPatients.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchTerm ? "No patients match your search criteria" : "No patients found"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {displayedPatients.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              viewMode="list"
              onView={() => onPatientClick?.(patient)}
              onEdit={() => onEditClick?.(patient)}
              onDelete={() => onDeleteClick?.(patient)}
            />
          ))}
          
          {/* Load More Button */}
          {displayCount < filteredPatients.length && (
            <div className="text-center py-4">
              <button
                onClick={handleLoadMore}
                className="text-sm text-primary hover:underline"
              >
                Load {Math.min(ITEMS_PER_PAGE, filteredPatients.length - displayCount)} more patients
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}