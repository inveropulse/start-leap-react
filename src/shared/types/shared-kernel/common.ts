export type PaginationState = {
  pageNo: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
};

export type ApiPaginationResponse<T> = PaginationState & {
  data: T[];
};

export type ApiResponse<T> = {
  data?: T;
  statusCode?: number;
  successful?: boolean;
  message?: string | null;
};

export type ApiBooleanResponse = ApiResponse<boolean> & {};

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}
export type SearchParams = {
  search?: string;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
};
