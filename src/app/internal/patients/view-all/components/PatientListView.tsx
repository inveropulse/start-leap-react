import { usePatientList, usePatientListStats } from "../hooks";
import { DeletePatientDialog } from "../../delete";
import { UpdatePatientModal } from "../../update";
import {
  ListViewHeader,
  ListViewStats,
  ListViewControls,
  ListViewContent,
  ListViewPagination,
} from "@/app/internal/shared";
import { PatientCard } from "../../shared/components/PatientCard";

interface PatientListViewProps {
  onAddPatient: () => void;
  enableSearchButton?: boolean;
  searchMinLength?: number;
}

export function PatientListView({
  onAddPatient,
  enableSearchButton = false,
  searchMinLength = 3,
}: PatientListViewProps) {
  const {
    searchParams,
    pendingSearch,
    viewMode,
    deletePatientId,
    editPatientId,
    data,
    isLoading,
    isError,
    isFetching,
    handleSearchChange,
    handleSearchButtonClick,
    handleSearchKeyDown,
    handlePageChange,
    handlePageSizeChange,
    handleRefresh,
    handlePatientView,
    handlePatientEdit,
    handlePatientDelete,
    toggleViewMode,
    setDeletePatientId,
    setEditPatientId,
  } = usePatientList({ enableSearchButton, searchMinLength });

  const { stats, isStatsLoading } = usePatientListStats(data);

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
          onRetry={handleRefresh}
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

      <ListViewStats stats={stats} isLoading={isLoading || isStatsLoading} />

      <ListViewControls
        searchValue={
          enableSearchButton ? pendingSearch : searchParams.search || ""
        }
        onSearchChange={handleSearchChange}
        onSearchKeyDown={handleSearchKeyDown}
        searchPlaceholder="Search patients..."
        viewMode={viewMode}
        onViewModeToggle={toggleViewMode}
        onRefresh={handleRefresh}
        isLoading={isFetching}
        showSearchButton={enableSearchButton}
        onSearchButtonClick={handleSearchButtonClick}
        searchMinLength={searchMinLength}
      />

      <ListViewContent
        viewMode={viewMode}
        isLoading={isLoading}
        isEmpty={data?.items.length === 0}
        emptyMessage={
          searchParams.search
            ? `No patients match "${searchParams.search}". Try adjusting your search.`
            : "No patients have been added yet. Create your first patient to get started."
        }
        emptyAction={
          !searchParams.search
            ? {
                label: "Add First Patient",
                onClick: onAddPatient,
              }
            : undefined
        }
      >
        {data?.items.map((patient) => (
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
          currentPage={data.pageNo}
          totalPages={data.totalPages}
          pageSize={data.pageSize}
          totalCount={data.totalCount}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      {/* Modals */}
      <DeletePatientDialog
        patientId={deletePatientId}
        onClose={() => setDeletePatientId(null)}
        onSuccess={() => setDeletePatientId(null)}
      />

      <UpdatePatientModal
        patientId={editPatientId}
        onClose={() => setEditPatientId(null)}
      />
    </div>
  );
}
