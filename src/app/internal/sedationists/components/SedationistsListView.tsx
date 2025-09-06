import { useState, useMemo } from 'react';
import { UserCheck, Users, Award, Calendar } from "lucide-react";
import { SedationistFilters } from './SedationistFilters';
import { SedationistCard } from './SedationistCard';
import { useSedationistsRequest } from '../hooks/useSedationistsRequest';
import { 
  SedationistFilters as FilterType, 
  PaginationState, 
  SedationistStatus,
  SedationistSpecialty,
  CertificationStatus
} from '../types';
import {
  ListViewHeader,
  ListViewStats,
  ListViewControls,
  ListViewContent,
  ListViewPagination
} from "../../shared";

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
    if (!data) return [];
    
    const active = data.items.filter(s => s.status === SedationistStatus.ACTIVE).length;
    const available = data.items.filter(s => 
      s.status === SedationistStatus.ACTIVE && s.availability.length > 0
    ).length;
    const certExpiring = data.items.filter(s =>
      s.certifications.some(cert => cert.status === CertificationStatus.EXPIRING_SOON)
    ).length;
    const totalCases = data.items.reduce((sum, s) => sum + s.totalProcedures, 0);

    return [
      {
        id: 'active',
        label: 'Active Sedationists',
        value: active,
        icon: UserCheck,
        color: 'success' as const,
        description: 'Currently practicing'
      },
      {
        id: 'available',
        label: 'Available Today',
        value: available,
        icon: Calendar,
        color: 'primary' as const,
        description: 'Available for procedures'
      },
      {
        id: 'certExpiring',
        label: 'Certs Expiring',
        value: certExpiring,
        icon: Award,
        color: 'warning' as const,
        description: 'Need renewal soon'
      },
      {
        id: 'totalCases',
        label: 'Total Cases',
        value: totalCases,
        icon: Users,
        color: 'default' as const,
        description: 'All-time procedures'
      }
    ];
  }, [data]);

  if (error) {
    return (
      <div className="space-y-6">
        <ListViewHeader
          title="Sedationists"
          description="Manage sedationist profiles, certifications, and availability"
          onAdd={onAddSedationist}
          addButtonText="Add Sedationist"
        />
        
        <ListViewContent
          viewMode={viewMode}
          error="Error loading sedationists"
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  // Get active filters count
  const getActiveFiltersCount = () => {
    return (
      (filters.status.length > 0 ? 1 : 0) +
      (filters.specialties.length > 0 ? 1 : 0) +
      (filters.certificationStatus.length > 0 ? 1 : 0) +
      (filters.availableOnly ? 1 : 0)
    );
  };

  return (
    <div className="space-y-6">
      <ListViewHeader
        title="Sedationists"
        description="Manage sedationist profiles, certifications, and availability"
        onAdd={onAddSedationist}
        addButtonText="Add Sedationist"
      />
      
      <ListViewStats stats={stats} isLoading={isLoading} />
      
      <ListViewControls
        searchValue={filters.search}
        onSearchChange={(value) => handleFiltersChange({ ...filters, search: value })}
        searchPlaceholder="Search sedationists..."
        viewMode={viewMode}
        onViewModeToggle={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
        onRefresh={() => refetch()}
        isLoading={isLoading}
        showFilters={true}
        filtersActive={getActiveFiltersCount()}
        onToggleFilters={() => {}} // Filters are always shown for now
      >
        <SedationistFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      </ListViewControls>

      <ListViewContent
        viewMode={viewMode}
        isLoading={isLoading}
        isEmpty={data?.items.length === 0}
        emptyMessage={
          filters.search || getActiveFiltersCount() > 0
            ? "Try adjusting your search or filters"
            : "Get started by adding your first sedationist"
        }
        emptyAction={(filters.search === '' && getActiveFiltersCount() === 0) ? {
          label: "Add Sedationist",
          onClick: onAddSedationist
        } : undefined}
      >
        {data?.items.map((sedationist) => (
          <SedationistCard
            key={sedationist.id}
            sedationist={sedationist}
            viewMode={viewMode}
            onClick={() => onViewSedationist(sedationist.id)}
          />
        ))}
      </ListViewContent>

      {data && data.totalCount > 0 && (
        <ListViewPagination
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