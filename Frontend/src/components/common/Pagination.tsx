/**
 * Pagination component for list pages.
 * Supports page navigation and page size selection.
 */

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const PAGE_SIZES = [10, 20, 50];

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalElements,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  return (
    <nav
      aria-label="Pagination"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 0',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <label htmlFor="page-size-select" style={{ fontSize: '0.875rem', color: '#374151' }}>
          Page size:
        </label>
        <select
          id="page-size-select"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', border: '1px solid #d1d5db' }}
        >
          {PAGE_SIZES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          {totalElements} total
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          aria-label="Previous page"
          style={{
            padding: '0.375rem 0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.25rem',
            cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
            backgroundColor: '#fff',
          }}
        >
          Previous
        </button>
        <span style={{ fontSize: '0.875rem', color: '#374151' }}>
          Page {currentPage + 1} of {totalPages || 1}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          aria-label="Next page"
          style={{
            padding: '0.375rem 0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.25rem',
            cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
            backgroundColor: '#fff',
          }}
        >
          Next
        </button>
      </div>
    </nav>
  );
}
