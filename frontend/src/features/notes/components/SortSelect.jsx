import { ArrowUpDown } from "lucide-react";

const SORT_OPTIONS = [
  { label: "Last updated", sortBy: "updated_at", order: "DESC" },
  { label: "Title (A–Z)", sortBy: "title", order: "ASC" },
];

function SortSelect({ value, onChange }) {
  const handleChange = (e) => {
    const selected = SORT_OPTIONS[Number(e.target.value)];
    onChange(selected);
  };

  const currentIndex = SORT_OPTIONS.findIndex(
    (opt) => opt.sortBy === value.sortBy && opt.order === value.order,
  );

  return (
    <div className="relative">
      <ArrowUpDown
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
      />
      <select
        value={currentIndex}
        onChange={handleChange}
        className="appearance-none border border-border rounded-full pl-8 pr-8 py-2 text-sm text-text-primary bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
      >
        {SORT_OPTIONS.map((opt, index) => (
          <option key={opt.label} value={index}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SortSelect;
