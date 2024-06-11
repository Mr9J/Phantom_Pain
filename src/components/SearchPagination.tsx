
import {
  Pagination,
  PaginationContent,
  // PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Props {
  totalPage: number;
  currentPage: number;
  onPageChange: (pageNumber: number) => void;
}

export const SearchPagination: React.FC<Props> = ({
  totalPage,
  currentPage,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPage }, (_, i) => i + 1);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() =>
              onPageChange(currentPage - 1 >= 1 ? currentPage - 1 : currentPage)
            }
          />
        </PaginationItem>
        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => onPageChange(page)}
              isActive={page === currentPage}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            onClick={() =>
              onPageChange(
                currentPage + 1 <= totalPage ? currentPage + 1 : currentPage
              )
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
