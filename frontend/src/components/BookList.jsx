import BookCard from "./BookCard";

export default function BookList({
  books,
  hasActiveFilter,
  onResetFilter,
  onEditBook,
  onDeleteBook,
  onChangeStatus,
}) {
  if (books.length === 0) {
    return (
      <div className="empty-state-card">
        <h3 className="empty-title">
          {hasActiveFilter
            ? "Tidak ada buku yang cocok"
            : "Belum ada koleksi buku"}
        </h3>
        <p className="empty-desc">
          {hasActiveFilter
            ? "Ubah kata kunci pencarian atau atur ulang filter yang aktif."
            : 'Klik "Tambah Buku" untuk mulai mencatat literatur.'}
        </p>
        {hasActiveFilter && (
          <button
            type="button"
            className="btn-secondary"
            style={{ marginTop: "12px" }}
            onClick={onResetFilter}
          >
            Reset Filter
          </button>
        )}
      </div>
    );
  }

  return (
    <ul className="book-list-container">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onEditBook={onEditBook}
          onDeleteBook={onDeleteBook}
          onChangeStatus={onChangeStatus}
        />
      ))}
    </ul>
  );
}
