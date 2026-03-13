import { MoveLeft, MoveRight } from "lucide-react";
import { useState, useEffect } from "react";

export interface Column<T> {
  label: string;
  data: keyof T;
  searchable?: boolean;
}

interface Pagination {
  page: number;
  pages: number;
  per_page: number;
  total: number;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  loading: boolean;
  pagination: Pagination;
  onFetch: (page: number, per_page: number, search?: string) => void;
  debounceTime?: number;
  showPagination?: boolean;
  showPerPage?: boolean;
  showSearch?: boolean;
}

export default function DataTable<T>({
  columns,
  data,
  loading,
  pagination,
  onFetch,
  debounceTime = 500,
  showPagination = true,
  showPerPage = true,
  showSearch = true,
}: Props<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  const { page: currentPage, pages: totalPages, per_page } = pagination;


  useEffect(() => {
    const handler = setTimeout(
      () => setDebouncedSearch(searchQuery),
      debounceTime
    );
    return () => clearTimeout(handler);
  }, [searchQuery, debounceTime]);


  useEffect(() => {
    onFetch(1, per_page, debouncedSearch);
  }, [debouncedSearch]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onFetch(currentPage + 1, per_page, debouncedSearch);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onFetch(currentPage - 1, per_page, debouncedSearch);
    }
  };

  const handlePageChange = (page: number) => {
    onFetch(page, per_page, debouncedSearch);
  };

  const handlePerPageChange = (newPerPage: number) => {
    onFetch(1, newPerPage, debouncedSearch);
  };


  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 1;

    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage - delta > 2) pages.push("…");

      for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
        pages.push(i);
      }

      if (currentPage + delta < totalPages - 1) pages.push("…");

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-between items-center">
        {showSearch &&
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded px-3 py-1"
          />
        }
        {/* <select
          value={sorting}
          onChange={(e) => handlePerPageChange(parseInt(e.target.value))}
          className="border rounded px-3 py-1"
        >
          {[5, 10, 25, 50].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select> */}
        {showPerPage &&
          <select
            value={per_page}
            onChange={(e) => handlePerPageChange(parseInt(e.target.value))}
            className="border rounded px-3 py-1"
          >
            {[5, 10, 25, 50].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        }
      </div>

      <table className="w-full border-collapse border text-sm">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.data)}
                className="border px-4 py-2 text-left bg-primary text-primary-foreground whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                No data found
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={String(col.data)} className="border px-4 py-2">
                    {row[col.data] as any}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {showPagination &&

        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            <MoveLeft />
          </button>

          <div className="space-x-2">
            {pageNumbers.map((num, idx) =>
              num === "…" ? (
                <span key={idx} className="px-3 py-1">
                  …
                </span>
              ) : (
                <button
                  key={num}
                  onClick={() => handlePageChange(num as number)}
                  className={`px-3 py-1 border rounded ${num === currentPage ? "bg-primary text-primary-foreground" : ""
                    }`}
                >
                  {num}
                </button>
              )
            )}
          </div>


          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            <MoveRight />
          </button>
        </div>
      }
    </div>
  );
}