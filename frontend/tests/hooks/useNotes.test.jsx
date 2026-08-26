import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNotes } from "../../src/features/notes/hooks/useNotes";
import { fetchNotes } from "../../src/services/noteService";

jest.mock("../../src/services/noteService");

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useNotes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns loading state initially, then success with data", async () => {
    fetchNotes.mockResolvedValue({
      notes: [{ id: 1, title: "Test Note" }],
      pagination: { page: 1, pageSize: 12, totalItems: 1, totalPages: 1 },
    });

    const { result } = renderHook(
      () =>
        useNotes({
          page: 1,
          pageSize: 12,
          sortBy: "updated_at",
          order: "DESC",
          search: "",
        }),
      { wrapper: createWrapper() },
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data.notes).toHaveLength(1);
    expect(result.current.isError).toBe(false);
  });

  it("returns an error state when the fetch fails", async () => {
    fetchNotes.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(
      () =>
        useNotes({
          page: 1,
          pageSize: 12,
          sortBy: "updated_at",
          order: "DESC",
          search: "",
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
