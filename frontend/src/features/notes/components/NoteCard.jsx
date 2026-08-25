import { Trash2 } from "lucide-react";
import { useState } from "react";
import Card from "../../../components/ui/Card";
import DeleteNoteModal from "./DeleteNoteModal";
import { sanitizeHtml } from "../../../utils/sanitizeHtml";

function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

function NoteCard({ note, onClick }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const plainText = stripHtml(note.body);
  const preview = plainText.slice(0, 55);
  const isTruncated = plainText.length > 55;

  const formattedDate = new Date(note.updated_at).toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
    },
  );

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handleToggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  return (
    <>
      <Card className="flex flex-col">
        <div
          role="button"
          tabIndex={0}
          onClick={onClick}
          onKeyDown={(e) => e.key === "Enter" && onClick(e)}
          className="text-left w-full flex-1 cursor-pointer"
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-text-primary truncate pr-2">
              {note.title}
            </h3>
            <span className="text-xs text-text-muted whitespace-nowrap">
              {formattedDate}
            </span>
          </div>

          {isExpanded ? (
            <div
              className="text-text-secondary text-sm mb-2 prose prose-sm max-w-none break-words overflow-x-hidden"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(note.body) }}
            />
          ) : (
            <p className="text-text-secondary text-sm line-clamp-3 mb-2">
              {preview || "No content"}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto pt-1">
          {isTruncated ? (
            <button
              type="button"
              onClick={handleToggleExpand}
              className="text-primary hover:underline text-xs font-medium"
            >
              {isExpanded ? "See less" : "See more"}
            </button>
          ) : (
            <span />
          )}

          <button
            type="button"
            onClick={handleDeleteClick}
            className="flex items-center gap-1 text-text-muted hover:text-error text-xs font-medium"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </Card>

      <DeleteNoteModal
        noteId={note.id}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}

export default NoteCard;
