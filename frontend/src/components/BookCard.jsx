import { useState } from "react";
import { STATUS_LABEL } from "../utils/status";

const STATUS_STYLE = {
  selesai: "status-done",
  sedang: "status-reading",
  rencana: "status-planned",
};

function CoverThumbnail({ title, coverUrl }) {
  const [failed, setFailed] = useState(false);

  const initials = title
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  if (!coverUrl || failed) {
    return (
      <div className="book-cover-fallback" aria-hidden="true">
        <span className="cover-monogram">{initials || "BK"}</span>
      </div>
    );
  }

  return (
    <img
      src={coverUrl}
      alt={`Sampul ${title}`}
      className="book-cover-img"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export default function BookCard({
  book,
  onEditBook,
  onDeleteBook,
  onChangeStatus,
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <li className="book-card-item">
      <div className="book-cover-box">
        <CoverThumbnail
          key={book.coverUrl ?? "no-cover"}
          title={book.title}
          coverUrl={book.coverUrl}
        />
      </div>

      <div className="book-info-main">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{book.author}</p>
        <div className="book-meta-row">
          <span className="meta-category-badge">{book.category}</span>
          <span className="meta-detail">Terbit {book.year}</span>
          {book.pages > 0 && (
            <span className="meta-detail">{book.pages} halaman</span>
          )}
        </div>
      </div>

      <div className="book-actions-col">
        <select
          aria-label={`Ubah status bacaan ${book.title}`}
          className={`status-select-pill ${STATUS_STYLE[book.status] ?? "status-planned"}`}
          value={book.status}
          onChange={(e) => onChangeStatus(book.id, e.target.value)}
        >
          {Object.entries(STATUS_LABEL).map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>

        {confirmDelete ? (
          <div className="confirm-delete-group">
            <button
              type="button"
              className="btn-confirm-yes"
              onClick={() => onDeleteBook(book.id)}
            >
              Hapus
            </button>
            <button
              type="button"
              className="btn-confirm-no"
              onClick={() => setConfirmDelete(false)}
            >
              Batal
            </button>
          </div>
        ) : (
          <div className="icon-actions">
            <button
              type="button"
              className="btn-text-action"
              onClick={() => onEditBook(book)}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn-text-action danger"
              onClick={() => setConfirmDelete(true)}
            >
              Hapus
            </button>
          </div>
        )}
      </div>
    </li>
  );
}
