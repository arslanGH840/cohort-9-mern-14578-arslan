import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNotes } from "../features/notes/hooks/useNotes";
import { usePagination } from "../features/notes/hooks/usePagination";
import { useDebouncedValue } from "../features/search/hooks/useDebouncedValue";
import NoteList from "../features/notes/components/NoteList";
import SortSelect from "../features/notes/components/SortSelect";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import Pagination from "../components/ui/Pagination";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 400);
  const { page, goToPage, resetPage } = usePagination(1);
  const [sort, setSort] = useState({ sortBy: "updated_at", order: "DESC" });

  const { data, isLoading, isError, refetch } = useNotes({
    page,
    pageSize: 12,
    sortBy: sort.sortBy,
    order: sort.order,
    search: debouncedSearch,
  });

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    resetPage();
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    resetPage();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">My Notes</h1>
          <p className="text-text-secondary text-sm mt-1">
            Welcome back, {user?.username}
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate("/notes/new")}
          className="flex items-center gap-1.5"
        >
          <Plus size={16} />
          New Note
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative w-full sm:w-80">
          <label htmlFor="note-search" className="sr-only">
            Search notes
          </label>
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
          <input
            id="note-search"
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={handleSearchChange}
            className="w-full border border-border rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
          />
        </div>

        <SortSelect value={sort} onChange={handleSortChange} />
      </div>

      {isLoading && <Loader label="Loading your notes..." />}

      {isError && (
        <ErrorState
          description="We couldn't load your notes. Please try again."
          onRetry={refetch}
        />
      )}

      {!isLoading && !isError && data?.notes.length === 0 && (
        <EmptyState
          icon={<Search size={24} />}
          title="No notes yet"
          description="Create your first note to get started."
          action={
            <Button
              variant="primary"
              onClick={() => navigate("/notes/new")}
              className="flex items-center gap-1.5"
            >
              <Plus size={16} />
              New Note
            </Button>
          }
        />
      )}

      {!isLoading && !isError && data?.notes.length > 0 && (
        <>
          <NoteList
            notes={data.notes}
            onNoteClick={(id) => navigate(`/notes/${id}`)}
          />
          <Pagination
            page={data.pagination.page}
            totalPages={data.pagination.totalPages}
            onPageChange={goToPage}
          />
        </>
      )}
    </div>
  );
}

export default Dashboard;
