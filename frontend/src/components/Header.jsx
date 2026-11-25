export default function Header({ onOpenAdd }) {
  return (
    <header className="app-header">
      <div>
        <h1 className="brand-title">Arsipindex</h1>
        <p className="subtitle">
          Sistem Manajemen Literatur & Pelacak Bacaan Digital
        </p>
      </div>

      <button type="button" className="btn-primary" onClick={onOpenAdd}>
        Tambah Buku
      </button>
    </header>
  );
}
