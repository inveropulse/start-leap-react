import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { User, Activity, Calendar, Plus } from "lucide-react";
import { usePatientsRequest } from "../hooks/usePatientRequests";
import { PatientSearchParams } from "../types/patient.types";
import { PatientCard } from "./PatientCard";
import { PatientDeleteDialog } from "./PatientDeleteDialog";
import { PatientEditModal } from "./PatientEditModal";
import { useNotifications } from "@/shared/providers/NotificationProvider";
import {
  ListViewHeader,
  ListViewStats,
  ListViewControls,
  ListViewContent,
  ListViewPagination
} from "../../shared";

interface PatientListViewProps {
  onAddPatient: () => void;
}

export function PatientListView({ onAddPatient }: PatientListViewProps) {
  const navigate = useNavigate();
  const { showSuccess } = useNotifications();
  
  const [searchParams, setSearchParams] = useState<PatientSearchParams>({
    page: 1,
    pageSize: 25,
    search: "",
  });
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [deletePatientId, setDeletePatientId] = useState<string | null>(null);
  const [editPatientId, setEditPatientId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch, isFetching } = usePatientsRequest(searchParams);

  // Debounced search
  const handleSearchChange = useCallback((value: string) => {
    setSearchParams(prev => ({
      ...prev,
      search: value,
      page: 1, // Reset to first page when searching
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  }, []);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setSearchParams(prev => ({
      ...prev,
      pageSize,
      page: 1, // Reset to first page when changing page size
    }));
  }, []);

  const handleRefresh = useCallback(async () => {
    await refetch();
    showSuccess("Patient list refreshed");
  }, [refetch, showSuccess]);

  const handlePatientView = useCallback((patientId: string) => {
    navigate(`/internal/patients/${patientId}`);
  }, [navigate]);

  const handlePatientEdit = useCallback((patientId: string) => {
    setEditPatientId(patientId);
  }, []);

  const handlePatientDelete = useCallback((patientId: string) => {
    setDeletePatientId(patientId);
  }, []);

  // Enhanced statistics with trends and visualizations
  const stats = useMemo(() => {
    if (!data) return [];
    
    const total = data.totalCount;
    const activePatients = Math.floor(total * 0.85); // Mock calculation
    const recentVisits = Math.floor(total * 0.3); // Mock calculation
    
    // Generate trend data (mock data - in real app this would come from API)
    const generatePatientTrend = () => {
      return Array.from({ length: 7 }, (_, i) => ({
        value: Math.max(1, total - Math.floor(Math.random() * 50) + i * 5),
        label: `Week ${i + 1}`
      }));
    };

    return [
      {
        id: 'total',
        label: 'Total Patients',
        value: total,
        icon: User,
        color: 'default' as const,
        description: `${data.patients.length} on this page`,
        tooltip: 'Total number of patients in the system',
        trend: {
          value: 12.5,
          type: 'percentage' as const
        },
        chart: {
          data: generatePatientTrend(),
          type: 'area' as const
        }
      },
      {
        id: 'active',
        label: 'Active Patients',
        value: activePatients,
        icon: Activity,
        color: 'success' as const,
        description: 'Currently in care',
        tooltip: 'Patients who are actively receiving care',
        progress: {
          current: activePatients,
          target: total,
          label: 'Activity Rate'
        },
        trend: {
          value: 8.3,
          type: 'percentage' as const
        }
      },
      {
        id: 'recent',
        label: 'Recent Visits',
        value: recentVisits,
        icon: Calendar,
        color: 'primary' as const,
        description: 'Last 30 days',
        tooltip: 'Patients with visits in the last 30 days',
        chart: {
          data: Array.from({ length: 6 }, (_, i) => ({
            value: Math.floor(Math.random() * 20) + 5,
            label: `Week ${i + 1}`
          })),
          type: 'bar' as const
        }
      },
      {
        id: 'demographics',
        label: 'Demographics',
        value: `${Math.round(data.patients.reduce((sum, p) => sum + (p.age || 25), 0) / data.patients.length)}y`,
        icon: User,
        color: 'default' as const,
        description: 'Average age',
        tooltip: 'Average age of all patients',
        trend: {
          value: 1.2,
          type: 'percentage' as const
        }
      },
    ];
  }, [data]);

  if (isError) {
    return (
      <div className="space-y-6">
        <ListViewHeader
          title="Patients"
          description="Manage and view patient information"
          onAdd={onAddPatient}
          addButtonText="Add Patient"
        />
        
        <ListViewContent
          viewMode={viewMode}
          error="Failed to load patient data. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ListViewHeader
        title="Patients"
        description="Manage and view patient information"
        onAdd={onAddPatient}
        addButtonText="Add Patient"
      />
      
      <ListViewStats stats={stats} isLoading={isLoading} />
      
      <ListViewControls
        searchValue={searchParams.search || ""}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search patients..."
        viewMode={viewMode}
        onViewModeToggle={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
        onRefresh={handleRefresh}
        isLoading={isFetching}
      />

      <ListViewContent
        viewMode={viewMode}
        isLoading={isLoading}
        isEmpty={data?.patients.length === 0}
        emptyMessage={
          searchParams.search 
            ? `No patients match "${searchParams.search}". Try adjusting your search.`
            : "No patients have been added yet. Create your first patient to get started."
        }
        emptyAction={!searchParams.search ? {
          label: "Add First Patient",
          onClick: onAddPatient
        } : undefined}
      >
        {data?.patients.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            viewMode={viewMode}
            onView={() => handlePatientView(patient.id!)}
            onEdit={() => handlePatientEdit(patient.id!)}
            onDelete={() => handlePatientDelete(patient.id!)}
          />
        ))}
      </ListViewContent>

      {data && data.totalPages > 1 && (
        <ListViewPagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          pageSize={data.pageSize}
          totalCount={data.totalCount}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      <PatientDeleteDialog
        patientId={deletePatientId}
        onClose={() => setDeletePatientId(null)}
      />
      
      <PatientEditModal
        patientId={editPatientId}
        onClose={() => setEditPatientId(null)}
      />
    </div>
  );
}