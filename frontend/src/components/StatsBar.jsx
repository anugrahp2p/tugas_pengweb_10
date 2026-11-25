export default function StatsBar({ stats, activeStatus, onSelectStatus }) {
  const items = [
    { key: "", label: "Semua Koleksi", value: stats.total },
    { key: "sedang", label: "Sedang Dibaca", value: stats.sedang },
    { key: "rencana", label: "Rencana", value: stats.rencana },
    { key: "selesai", label: "Selesai", value: stats.selesai },
  ];

  return (
    <nav className="stats-ledger" aria-label="Filter status koleksi">
      {items.map((item) => {
        const isActive = activeStatus === item.key;
        return (
          <button
            key={item.label}
            type="button"
            aria-pressed={isActive}
            className={`stat-cell ${isActive ? "active" : ""}`}
            onClick={() => onSelectStatus(item.key)}
          >
            <span className="stat-label">{item.label}</span>
            <span className="stat-value">{item.value}</span>
          </button>
        );
      })}
    </nav>
  );
}
