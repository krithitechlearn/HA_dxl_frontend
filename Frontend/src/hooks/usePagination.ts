/**
 * usePagination hook.
 * Manages pagination state for list pages.
 */
import { useState } from 'react';

interface PaginationState {
  page: number;
  size: number;
}

interface UsePaginationReturn extends PaginationState {
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  reset: () => void;
}

export function usePagination(defaultSize = 20): UsePaginationReturn {
  const [page, setPageState] = useState(0);
  const [size, setSizeState] = useState(defaultSize);

  const setPage = (p: number) => setPageState(p);
  const setSize = (s: number) => {
    setSizeState(s);
    setPageState(0);
  };
  const reset = () => {
    setPageState(0);
    setSizeState(defaultSize);
  };

  return { page, size, setPage, setSize, reset };
}
