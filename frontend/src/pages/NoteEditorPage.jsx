import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useNote } from "../features/notes/hooks/useNote";
import {
  useCreateNote,
  useUpdateNote,
} from "../features/notes/hooks/useNoteMutations";
import NoteForm from "../features/notes/components/NoteForm";
import Loader from "../components/ui/Loader";
import ErrorState from "../components/ui/ErrorState";

function NoteEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const { data: existingNote, isLoading, isError } = useNote(id);
  const createMutation = useCreateNote();
  const updateMutation = useUpdateNote();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (formData) => {
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({ id, data: formData });
        toast.success("Note updated");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Note created");
      }
      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.error?.message || "Failed to save note",
      );
    }
  };

  if (isEditMode && isLoading) {
    return <Loader label="Loading note..." />;
  }

  if (isEditMode && isError) {
    return (
      <ErrorState
        title="Note not found"
        description="This note doesn't exist or you don't have access to it."
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-text-primary mb-6">
        {isEditMode ? "Edit Note" : "New Note"}
      </h1>
      <NoteForm
        key={id ?? "new"}
        defaultValues={
          isEditMode
            ? { title: existingNote.title, body: existingNote.body }
            : undefined
        }
        onSubmit={handleSubmit}
        onCancel={() => navigate("/")}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default NoteEditorPage;
