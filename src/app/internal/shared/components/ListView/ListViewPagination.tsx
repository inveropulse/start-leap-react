import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useListViewTheme } from "../../hooks/useListViewTheme";
import { ListViewPaginationProps } from "../../types/listView.types";

export function ListViewPagination({
  currentPage,
  totalPages,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  isLoading
}: ListViewPaginationProps) {
  const theme = useListViewTheme();

  const startIndex = Math.max(0, (currentPage - 1) * pageSize);
  const endIndex = Math.min(totalCount, startIndex + pageSize);

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage > 4) {
        pages.push('...');
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 3) {
        pages.push('...');
      }
      
      pages.push(totalPages);
    }

    return pages;
  };

  // Don't show pagination if no items
  if (totalCount === 0) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-muted-foreground">
      {/* Results Summary */}
      <div className="flex-1">
        {isLoading ? (
          <span>Loading...</span>
        ) : (
          <span>
            Showing {startIndex + 1} to {endIndex} of {totalCount} results
          </span>
        )}
      </div>

      {/* Page Size Selector */}
      <div className="flex items-center gap-2">
        <span>Show</span>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(parseInt(value))}
          disabled={isLoading}
        >
          <SelectTrigger className="w-16">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
        <span>per page</span>
      </div>

      {/* Page Navigation */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}
          className={theme.buttonSecondaryClass}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        {getVisiblePages().map((page, index) => (
          <Button
            key={index}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => typeof page === 'number' ? onPageChange(page) : undefined}
            disabled={typeof page !== 'number' || isLoading}
            className={
              page === currentPage 
                ? theme.buttonPrimaryClass 
                : theme.buttonSecondaryClass
            }
          >
            {page}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isLoading}
          className={theme.buttonSecondaryClass}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}