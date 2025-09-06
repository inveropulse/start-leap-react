import { useState, useMemo } from 'react';
import { Plus, RefreshCw, Grid3X3, List, Search, Filter } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { SedationistFilters } from './SedationistFilters';
import { SedationistCard } from './SedationistCard';
import { SedationistPagination } from './SedationistPagination';
import { useSedationistsRequest } from '../hooks/useSedationistsRequest';
import { 
  SedationistFilters as FilterType, 
  PaginationState, 
  SedationistStatus,
  SedationistSpecialty,
  CertificationStatus
} from '../types';
import { UserCheck, Users, Award, Calendar } from "lucide-react";

interface SedationistsListViewProps {
  onAddSedationist: () => void;
  onViewSedationist: (sedationistId: string) => void;
}

export function SedationistsListView({ onAddSedationist, onViewSedationist }: SedationistsListViewProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterType>({
    search: '',
    status: [],
    specialties: [],
    certificationStatus: [],
    availableOnly: false,
  });
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 25,
    total: 0,
  });

  const searchParams = useMemo(() => ({
    search: filters.search,
    status: filters.status,
    specialties: filters.specialties,
    certificationStatus: filters.certificationStatus,
    availableOnly: filters.availableOnly,
    pageNo: pagination.page,
    pageSize: pagination.pageSize,
  }), [filters, pagination.page, pagination.pageSize]);

  const { data, isLoading, error, refetch } = useSedationistsRequest(searchParams);

  // Update pagination total when data changes
  useMemo(() => {
    if (data) {
      setPagination(prev => ({ ...prev, total: data.totalCount }));
    }
  }, [data?.totalCount]);

  // Reset to page 1 when filters change
  const handleFiltersChange = (newFilters: FilterType) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPagination(prev => ({ ...prev, pageSize, page: 1 }));
  };

  // Calculate stats
  const stats = useMemo(() => {
    if (!data) return { active: 0, available: 0, certExpiring: 0, totalCases: 0 };
    
    const active = data.items.filter(s => s.status === SedationistStatus.ACTIVE).length;
    const available = data.items.filter(s => 
      s.status === SedationistStatus.ACTIVE && s.availability.length > 0
    ).length;
    const certExpiring = data.items.filter(s =>
      s.certifications.some(cert => cert.status === CertificationStatus.EXPIRING_SOON)
    ).length;
    const totalCases = data.items.reduce((sum, s) => sum + s.totalProcedures, 0);

    return { active, available, certExpiring, totalCases };
  }, [data]);

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sedationists</h1>
            <p className="text-muted-foreground">
              Manage sedationist profiles, certifications, and availability
            </p>
          </div>
          <Button onClick={onAddSedationist}>
            <Plus className="mr-2 h-4 w-4" />
            Add Sedationist
          </Button>
        </div>
        
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <div className="text-center">
              <p className="text-destructive mb-2">Error loading sedationists</p>
              <Button variant="outline" onClick={() => refetch()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sedationists</h1>
          <p className="text-muted-foreground">
            Manage sedationist profiles, certifications, and availability
          </p>
        </div>
        <Button onClick={onAddSedationist}>
          <Plus className="mr-2 h-4 w-4" />
          Add Sedationist
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sedationists</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              Currently practicing
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.available}</div>
            <p className="text-xs text-muted-foreground">
              Available for procedures
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certs Expiring</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.certExpiring}</div>
            <p className="text-xs text-muted-foreground">
              Need renewal soon
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCases}</div>
            <p className="text-xs text-muted-foreground">
              All-time procedures
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Search & Filter</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <SedationistFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </CardContent>
      </Card>

      {/* Sedationists Grid/List */}
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Loading sedationists...</span>
              </div>
            </div>
          ) : data?.items.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No sedationists found</h3>
                <p className="text-muted-foreground mb-4">
                  {filters.search || filters.status.length > 0
                    ? "Try adjusting your search or filters"
                    : "Get started by adding your first sedationist"}
                </p>
                <Button onClick={onAddSedationist}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Sedationist
                </Button>
              </div>
            </div>
          ) : (
            <div className={
              viewMode === 'grid'
                ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                : "space-y-4"
            }>
              {data?.items.map((sedationist) => (
                <SedationistCard
                  key={sedationist.id}
                  sedationist={sedationist}
                  viewMode={viewMode}
                  onClick={() => onViewSedationist(sedationist.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {data && data.totalCount > 0 && (
        <SedationistPagination
          currentPage={pagination.page}
          totalPages={Math.ceil(pagination.total / pagination.pageSize)}
          pageSize={pagination.pageSize}
          totalCount={pagination.total}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
}