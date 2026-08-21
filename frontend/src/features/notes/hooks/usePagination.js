import { useState } from "react";

export function usePagination(initialPage = 1) {
  const [page, setPage] = useState(initialPage);

  const goToPage = (newPage) => {
    setPage(Math.max(1, newPage));
  };

  const resetPage = () => setPage(1);

  return { page, goToPage, resetPage };
}
