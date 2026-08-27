import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useCreateNote,
  useUpdateNote,
  useDeleteNote,
} from "../../src/features/notes/hooks/useNoteMutations";
import {
  createNote,
  updateNote,
  deleteNote,
} from "../../src/services/noteService";

jest.mock("../../src/services/noteService");

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe("useNoteMutations", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("useCreateNote calls createNote and succeeds", async () => {
    createNote.mockResolvedValue({ id: 1, title: "New Note" });

    const { result } = renderHook(() => useCreateNote(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ title: "New Note", body: "<p>Body</p>" });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(createNote).toHaveBeenCalledWith(
      { title: "New Note", body: "<p>Body</p>" },
      expect.anything(),
    );
  });

  it("useUpdateNote calls updateNote with id and data", async () => {
    updateNote.mockResolvedValue({ id: 1, title: "Updated" });

    const { result } = renderHook(() => useUpdateNote(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ id: 1, data: { title: "Updated" } });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(updateNote).toHaveBeenCalledWith(1, { title: "Updated" });
  });

  it("useDeleteNote calls deleteNote and succeeds", async () => {
    deleteNote.mockResolvedValue({ message: "Note deleted successfully" });

    const { result } = renderHook(() => useDeleteNote(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(1);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(deleteNote).toHaveBeenCalledWith(1, expect.anything());
  });

  it("useCreateNote reflects an error state when the mutation fails", async () => {
    createNote.mockRejectedValue(new Error("Failed to create"));

    const { result } = renderHook(() => useCreateNote(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ title: "X", body: "Y" });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
