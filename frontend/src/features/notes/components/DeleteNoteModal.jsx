import { toast } from "react-toastify";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import { useDeleteNote } from "../hooks/useNoteMutations";

function DeleteNoteModal({ noteId, isOpen, onClose }) {
  const deleteMutation = useDeleteNote();

  const handleConfirm = async () => {
    try {
      await deleteMutation.mutateAsync(noteId);
      toast.success("Note deleted");
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.error?.message || "Failed to delete note",
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete this note?">
      <h2 className="text-lg font-semibold text-text-primary mb-2">
        Delete this note?
      </h2>
      <p className="text-text-secondary text-sm mb-6">
        This action cannot be undone. The note will be permanently deleted.
      </p>
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={handleConfirm}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </Modal>
  );
}

export default DeleteNoteModal;
