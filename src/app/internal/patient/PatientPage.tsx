import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { useQuickAction } from "@/shared/hooks/useQuickAction";
import { InternalQuickActionKey } from "@/routes/internal_routes";
import { usePatientsRequest } from "./hooks/usePatientsRequest";
import { Patient } from "./types/patient.types";
import { PatientCreateModal } from "./components/PatientCreateModal";
import { PatientEditModal } from "./components/PatientEditModal";
import { PatientDeleteDialog } from "./components/PatientDeleteDialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { 
  Users, 
  Plus, 
  Search, 
  RefreshCw, 
  Edit, 
  Trash2, 
  Eye,
  Phone,
  Mail,
  Calendar,
  MapPin
} from "lucide-react";

export default function PatientPage() {
  const [openAddPatient, setOpenAddPatient] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<Patient | null>(null);
  const [searchText, setSearchText] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const pageSize = 12;

  // Fetch patients with search and pagination
  const { data: patientsData, isLoading, error, refetch, isRefetching } = usePatientsRequest({
    search: searchText,
    page: pageNo,
    pageSize,
  });

  const handleQA = useCallback((qa: string) => {
    switch (qa) {
      case InternalQuickActionKey.ADD_PATIENT:
        setOpenAddPatient(true);
        break;
    }
  }, []);

  useQuickAction(handleQA);

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPageNo(1); // Reset to first page when searching
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const PatientCardSkeleton = () => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground">
            Manage patient records and information
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => setOpenAddPatient(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </div>
      </div>

      {/* Stats Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              patientsData?.totalCount || 0
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {isLoading ? (
              <Skeleton className="h-4 w-24" />
            ) : (
              `Showing ${patientsData?.items.length || 0} of ${patientsData?.totalCount || 0} patients`
            )}
          </p>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search patients by name, email, or phone..."
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="p-6">
            <p className="text-destructive">
              Failed to load patients. Please try again.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, index) => (
            <PatientCardSkeleton key={index} />
          ))
        ) : patientsData?.items.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No patients found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchText ? "No patients match your search criteria." : "Get started by adding your first patient."}
                </p>
                {!searchText && (
                  <Button onClick={() => setOpenAddPatient(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Patient
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          patientsData?.items.map((patient) => (
            <Card key={patient.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {patient.firstName[0]}{patient.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {patient.title} {patient.firstName} {patient.lastName}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        Age {calculateAge(patient.dateOfBirth)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{patient.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>{patient.phoneNumber}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(patient.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{patient.address}</span>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link to={`/internal/patients/${patient.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingPatient(patient)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeletingPatient(patient)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                  ID: {patient.id}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {patientsData && patientsData.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageNo(Math.max(1, pageNo - 1))}
            disabled={pageNo === 1}
          >
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            {Array(patientsData.totalPages).fill(0).map((_, index) => {
              const page = index + 1;
              return (
                <Button
                  key={page}
                  variant={page === pageNo ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPageNo(page)}
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
            onClick={() => setPageNo(Math.min(patientsData.totalPages, pageNo + 1))}
            disabled={pageNo === patientsData.totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Modals */}
      <PatientCreateModal
        open={openAddPatient}
        onOpenChange={setOpenAddPatient}
      />

      <PatientEditModal
        open={!!editingPatient}
        onOpenChange={(open) => !open && setEditingPatient(null)}
        patient={editingPatient}
      />

      <PatientDeleteDialog
        open={!!deletingPatient}
        onOpenChange={(open) => !open && setDeletingPatient(null)}
        patient={deletingPatient}
      />
    </div>
  );
}