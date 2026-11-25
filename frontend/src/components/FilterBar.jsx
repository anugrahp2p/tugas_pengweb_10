import { CATEGORIES } from "../utils/status";

export default function FilterBar({ filters, onChange }) {
  const setField = (field) => (e) =>
    onChange({ ...filters, [field]: e.target.value });

  const isFiltered = Boolean(
    filters.status || filters.category || filters.search,
  );

  return (
    <div className="filter-controls">
      <div className="search-box">
        <input
          type="text"
          placeholder="Cari judul buku atau penulis..."
          value={filters.search}
          onChange={setField("search")}
          aria-label="Cari judul atau penulis"
        />
        {filters.search && (
          <button
            type="button"
            className="search-clear"
            onClick={() => onChange({ ...filters, search: "" })}
            aria-label="Hapus pencarian"
          >
            ✕
          </button>
        )}
      </div>

      <select
        className="category-select"
        value={filters.category}
        onChange={setField("category")}
        aria-label="Filter genre"
      >
        <option value="">Semua genre</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {isFiltered && (
        <button
          type="button"
          className="btn-secondary"
          onClick={() => onChange({ status: "", category: "", search: "" })}
        >
          Reset
        </button>
      )}
    </div>
  );
}
