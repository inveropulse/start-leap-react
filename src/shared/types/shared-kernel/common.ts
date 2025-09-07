// Cross-domain shared concepts
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export interface PaginationResponse<T> {
  items: T[];
  totalCount: number;
  pageNo: number;
  pageSize: number;
  totalPages: number;
}

export interface SearchParams {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  data?: T;
  successful?: boolean;
  message?: string | null;
  statusCode?: number;
}

export interface BooleanResponse {
  data?: boolean;
  successful?: boolean;
  message?: string | null;
  statusCode?: number;
}