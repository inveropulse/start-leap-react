import { useCallback, useState } from "react";
import { useQuickAction } from "@/shared/hooks/useQuickAction";
import { InternalQuickActionKey } from "@/routes/internal_routes";
import { usePatientsRequest } from "./hooks/usePatientsRequest";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Search, Plus, RefreshCw, Users } from "lucide-react";

export default function PatientPage() {
  const [openAddPatient, setOpenAddPatient] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error, refetch, isRefetching } = usePatientsRequest({
    searchText: searchText || undefined,
    pageNo,
    pageSize,
  });

  const handleQA = useCallback((qa: string) => {
    switch (qa) {
      case InternalQuickActionKey.ADD_PATIENT:
        setOpenAddPatient(true);
        break;
      // handle more quick actions here
    }
  }, []);

  useQuickAction(handleQA);

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPageNo(1); // Reset to first page when searching
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Patients</h1>
          <p className="text-muted-foreground">Manage patient records and information</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
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
      {data && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{data.totalCount}</span>
              <span className="text-muted-foreground">Total Patients</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search patients by name, email, or phone..."
          className="pl-10"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: pageSize }).map((_, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading patients: {error.message}</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Patient List */}
          <div className="space-y-4">
            {data?.payload.map((patient) => (
              <Card key={patient.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground">
                        {patient.fullName}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <span>Age: {patient.age}</span>
                        <span>•</span>
                        <span>{patient.email}</span>
                        {patient.phoneNumber && (
                          <>
                            <span>•</span>
                            <span>{patient.phoneNumber}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Badge variant="secondary">
                      ID: {patient.id}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-4">
              <Button
                variant="outline"
                disabled={pageNo <= 1}
                onClick={() => setPageNo(pageNo - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {pageNo} of {data.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={pageNo >= data.totalPages}
                onClick={() => setPageNo(pageNo + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Debug Info */}
      <div className="text-xs text-muted-foreground">
        openAddPatient: {openAddPatient.toString()}
      </div>
    </div>
  );
}
