import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "../../../services/noteService";

export function useNote(id) {
  return useQuery({
    queryKey: ["notes", id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
  });
}
