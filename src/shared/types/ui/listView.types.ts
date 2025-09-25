export interface ListViewHeaderProps {
  title: string;
  description: string;
  onAdd: () => void;
  addButtonText: string;
}

export interface ListViewStat {
  id: string;
  label: string;
  value: number | string;
  icon?: React.ComponentType<{ className?: string }>;
  color?: "default" | "success" | "warning" | "primary";
  description?: string;
  trend?: {
    value: number;
    type: "percentage" | "value";
  };
  progress?: {
    current: number;
    target: number;
    label?: string;
  };
  chart?: {
    data: Array<{ value: number; label?: string }>;
    type?: "line" | "bar" | "area";
  };
  tooltip?: string;
}

export interface ListViewControlsProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  viewMode: "grid" | "list";
  onViewModeToggle: () => void;
  onRefresh: () => void;
  isLoading?: boolean;
  showFilters?: boolean;
  filtersActive?: boolean | number;
  onToggleFilters?: () => void;

  // Search button configuration
  showSearchButton?: boolean;
  searchMinLength?: number;

  children?: React.ReactNode; // For custom filters
}

export interface ListViewContentProps {
  viewMode: "grid" | "list";
  isLoading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
  emptyMessage?: string;
  emptyAction?: {
    label: string;
    onClick: () => void;
  };
  onRetry?: () => void;
  loadingSkeletonCount?: number;
  children?: React.ReactNode;
}

export interface ListViewPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  isLoading?: boolean;
}
