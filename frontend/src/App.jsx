import { useCallback, useEffect, useState } from "react";
import Header from "./components/Header";
import StatsBar from "./components/StatsBar";
import BookForm from "./components/BookForm";
import FilterBar from "./components/FilterBar";
import BookList from "./components/BookList";
import {
  createBook,
  deleteBook,
  fetchBooks,
  fetchStats,
  updateBook,
} from "./api/books";
import "./App.css";

const EMPTY_FILTERS = { status: "", category: "", search: "" };

export default function App() {
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    selesai: 0,
    sedang: 0,
    rencana: 0,
  });
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [modalBook, setModalBook] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2400);
  };

  const loadData = useCallback(async () => {
    try {
      const [list, summary] = await Promise.all([
        fetchBooks(filters),
        fetchStats(),
      ]);
      setBooks(list);
      setStats(summary);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const t = setTimeout(loadData, 220);
    return () => clearTimeout(t);
  }, [loadData]);

  const runAction = async (action, successMessage) => {
    try {
      await action();
      await loadData();
      if (successMessage) showToast(successMessage);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleSaveBook = (payload, bookId) => {
    if (bookId) {
      return runAction(
        () => updateBook(bookId, payload),
        "Perubahan buku disimpan.",
      );
    }
    return runAction(() => createBook(payload), "Buku ditambahkan ke koleksi.");
  };

  const handleChangeStatus = (bookId, status) =>
    runAction(
      () => updateBook(bookId, { status }),
      "Status bacaan diperbarui.",
    ).catch(() => {});

  const handleDeleteBook = (id) =>
    runAction(() => deleteBook(id), "Buku dihapus dari arsip.").catch(() => {});

  const handleSelectStatusFilter = (status) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status === status ? "" : status,
    }));
  };

  return (
    <div className="layout-container">
      <Header onOpenAdd={() => setModalBook("create")} />

      <main>
        <StatsBar
          stats={stats}
          activeStatus={filters.status}
          onSelectStatus={handleSelectStatusFilter}
        />

        <section aria-label="Daftar Buku">
          <div className="workspace-header">
            <h2 className="section-title">Daftar Buku</h2>
            {!loading && (
              <span className="result-count">
                {books.length} dari {stats.total} buku
              </span>
            )}
          </div>

          <FilterBar filters={filters} onChange={setFilters} />

          {error && (
            <div className="error-banner" role="alert">
              {error}
            </div>
          )}

          {loading ? (
            <div className="empty-state-card">
              <p className="empty-desc">Memuat koleksi...</p>
            </div>
          ) : (
            <BookList
              books={books}
              hasActiveFilter={Boolean(
                filters.status || filters.category || filters.search,
              )}
              onResetFilter={() => setFilters(EMPTY_FILTERS)}
              onEditBook={(book) => setModalBook(book)}
              onDeleteBook={handleDeleteBook}
              onChangeStatus={handleChangeStatus}
            />
          )}
        </section>
      </main>

      {modalBook && (
        <BookForm
          key={modalBook === "create" ? "create" : modalBook.id}
          initialBook={modalBook === "create" ? null : modalBook}
          onClose={() => setModalBook(null)}
          onSubmitBook={handleSaveBook}
        />
      )}

      {toast && (
        <div className="toast-banner" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
