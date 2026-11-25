import { useEffect, useRef, useState } from "react";
import { CATEGORIES } from "../utils/status";

const STATUS_OPTIONS = [
  { value: "rencana", label: "Rencana" },
  { value: "sedang", label: "Sedang Dibaca" },
  { value: "selesai", label: "Selesai" },
];

function compressImageToDataUrl(file, maxWidth = 340, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("File gambar tidak dapat dibaca."));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error("Gagal membaca file gambar."));
    reader.readAsDataURL(file);
  });
}

export default function BookForm({ initialBook, onClose, onSubmitBook }) {
  const [formData, setFormData] = useState(() =>
    initialBook
      ? {
          title: initialBook.title,
          author: initialBook.author,
          category: initialBook.category,
          year: String(initialBook.year),
          pages: initialBook.pages ? String(initialBook.pages) : "",
          status: initialBook.status,
          coverUrl: initialBook.coverUrl ?? "",
        }
      : {
          title: "",
          author: "",
          category: "Filsafat",
          year: "",
          pages: "",
          status: "rencana",
          coverUrl: "",
        },
  );
  const [previewError, setPreviewError] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleChange = (field) => (e) => {
    if (field === "coverUrl") {
      setPreviewError(false);
      setUploadError("");
    }
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Pilih file gambar (JPG, PNG, atau WebP).");
      return;
    }

    try {
      setUploadError("");
      setPreviewError(false);
      const dataUrl = await compressImageToDataUrl(file);
      setFormData((prev) => ({ ...prev, coverUrl: dataUrl }));
    } catch (err) {
      setUploadError(err.message);
    } finally {
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.author.trim() || !formData.year)
      return;

    const trimmedCover = formData.coverUrl.trim();
    const payload = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      category: formData.category,
      year: parseInt(formData.year, 10),
      pages: parseInt(formData.pages, 10) || 0,
      status: formData.status,
    };

    if (trimmedCover) {
      payload.coverUrl = trimmedCover;
    } else if (initialBook) {
      payload.coverUrl = null;
    }

    setSubmitting(true);
    try {
      await onSubmitBook(payload, initialBook?.id);
      onClose();
    } catch {
      // Pesan error ditampilkan oleh App.jsx
    } finally {
      setSubmitting(false);
    }
  };

  const isUploadedFile = formData.coverUrl.startsWith("data:image/");

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-book-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-card">
        <div className="modal-header">
          <h3 id="modal-book-title" className="modal-title">
            {initialBook ? "Edit Buku" : "Tambah Buku"}
          </h3>
          <button
            type="button"
            className="btn-close-modal"
            onClick={onClose}
            aria-label="Tutup dialog"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-stack">
            <div className="form-group">
              <label htmlFor="title">Judul Buku</label>
              <input
                id="title"
                type="text"
                placeholder="Judul lengkap buku"
                value={formData.title}
                onChange={handleChange("title")}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="author">Penulis</label>
              <input
                id="author"
                type="text"
                placeholder="Nama penulis"
                value={formData.author}
                onChange={handleChange("author")}
                required
              />
            </div>

            <div className="form-row-pair">
              <div className="form-group">
                <label htmlFor="category">Genre</label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={handleChange("category")}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="year">Tahun Terbit</label>
                <input
                  id="year"
                  type="number"
                  min="1"
                  max="2100"
                  placeholder="2024"
                  value={formData.year}
                  onChange={handleChange("year")}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="pages">
                <span>Jumlah Halaman</span>
                <span className="label-optional">Opsional</span>
              </label>
              <input
                id="pages"
                type="number"
                min="0"
                placeholder="0"
                value={formData.pages}
                onChange={handleChange("pages")}
              />
            </div>

            <div className="form-group">
              <span className="field-label">Status Bacaan</span>
              <div
                className="status-radio-group"
                role="radiogroup"
                aria-label="Status bacaan"
              >
                {STATUS_OPTIONS.map((opt) => {
                  const selected = formData.status === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      className={`status-radio-option ${selected ? "selected" : ""}`}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, status: opt.value }))
                      }
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="coverUrl">
                <span>Sampul Buku</span>
                <span className="label-optional">Opsional</span>
              </label>

              <div className="cover-picker-card">
                <div className="cover-preview-box">
                  {formData.coverUrl.trim() && !previewError ? (
                    <img
                      src={formData.coverUrl.trim()}
                      alt="Pratinjau sampul"
                      onError={() => setPreviewError(true)}
                    />
                  ) : (
                    <span>{previewError ? "URL invalid" : "Sampul"}</span>
                  )}
                </div>

                <div className="cover-controls">
                  <div className="cover-upload-actions">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleFileChange}
                      hidden
                    />
                    <button
                      type="button"
                      className="btn-upload-trigger"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Pilih Gambar
                    </button>

                    {formData.coverUrl && (
                      <button
                        type="button"
                        className="btn-remove-cover"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, coverUrl: "" }));
                          setPreviewError(false);
                          setUploadError("");
                        }}
                      >
                        Hapus
                      </button>
                    )}
                  </div>

                  {!isUploadedFile ? (
                    <input
                      id="coverUrl"
                      type="url"
                      className="cover-url-input"
                      placeholder="Atau tempel URL gambar (https://...)"
                      value={formData.coverUrl}
                      onChange={handleChange("coverUrl")}
                    />
                  ) : (
                    <span className="cover-hint">Gambar siap disimpan.</span>
                  )}

                  {uploadError && (
                    <span
                      className="cover-hint"
                      style={{ color: "var(--danger-red)" }}
                    >
                      {uploadError}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Menyimpan…" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
