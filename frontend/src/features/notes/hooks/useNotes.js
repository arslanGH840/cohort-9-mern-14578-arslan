import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../../services/noteService";

export function useNotes({ page, pageSize, sortBy, order, search }) {
  return useQuery({
    queryKey: ["notes", { page, pageSize, sortBy, order, search }],
    queryFn: () => fetchNotes({ page, pageSize, sortBy, order, search }),
  });
}
