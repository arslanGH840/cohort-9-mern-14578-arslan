import Card from "../../../components/ui/Card";

function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

function NoteCard({ note, onClick }) {
  const preview = stripHtml(note.body).slice(0, 120);
  const formattedDate = new Date(note.updated_at).toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
    },
  );

  return (
    <Card hoverable onClick={onClick}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-text-primary truncate pr-2">
          {note.title}
        </h3>
        <span className="text-xs text-text-muted whitespace-nowrap">
          {formattedDate}
        </span>
      </div>
      <p className="text-text-secondary text-sm line-clamp-3">
        {preview || "No content"}
      </p>
    </Card>
  );
}

export default NoteCard;
