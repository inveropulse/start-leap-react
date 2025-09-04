import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, RefreshCw, Filter, Grid, List } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { usePortalTheme } from "@/shared/hooks/usePortalTheme";
import { PortalType } from "@/shared/types";
import { usePatientsRequest } from "../hooks/usePatientRequests";
import { PatientSearchParams } from "../types/patient.types";
import { PatientCard } from "./PatientCard";
import { PatientPagination } from "./PatientPagination";
import { PatientDeleteDialog } from "./PatientDeleteDialog";
import { PatientEditModal } from "./PatientEditModal";
import { useNotifications } from "@/shared/providers/NotificationProvider";

interface PatientListViewProps {
  onAddPatient: () => void;
}

export function PatientListView({ onAddPatient }: PatientListViewProps) {
  const navigate = useNavigate();
  const theme = usePortalTheme(PortalType.INTERNAL);
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

  const stats = useMemo(() => {
    if (!data) return { total: 0, showing: 0 };
    return {
      total: data.totalCount,
      showing: data.patients.length,
    };
  }, [data]);

  if (isError) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-destructive mb-4">
            <h3 className="text-lg font-semibold">Error Loading Patients</h3>
            <p className="text-sm text-muted-foreground">
              Failed to load patient data. Please try again.
            </p>
          </div>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground">
            Manage and view patient information
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={onAddPatient} 
            className={`${theme.primaryClass} hover:opacity-90`}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </div>
      </div>

      {/* Stats & Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search & Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
                  value={searchParams.search || ""}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Badge variant="secondary" className="px-3 py-1">
                  {stats.showing} of {stats.total} patients
                </Badge>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isFetching}
              >
                <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient List */}
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
              {Array.from({ length: 8 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[160px]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : data?.patients.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <h3 className="text-lg font-semibold">No Patients Found</h3>
                <p className="text-sm">
                  {searchParams.search 
                    ? `No patients match "${searchParams.search}". Try adjusting your search.`
                    : "No patients have been added yet. Create your first patient to get started."
                  }
                </p>
              </div>
              {!searchParams.search && (
                <Button onClick={onAddPatient} className={theme.primaryClass}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Patient
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
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
              </div>

              {data && data.totalPages > 1 && (
                <div className="mt-6 pt-6 border-t">
                  <PatientPagination
                    currentPage={data.currentPage}
                    totalPages={data.totalPages}
                    pageSize={data.pageSize}
                    totalCount={data.totalCount}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
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