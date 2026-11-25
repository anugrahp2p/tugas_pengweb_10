const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new Error("Tidak dapat terhubung ke server. Pastikan backend berjalan.");
  }

  if (res.status === 204) return null;

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    // Filter backend selalu mengembalikan { statusCode, path, timestamp, message }
    // dengan message berupa string atau array string.
    const msg = Array.isArray(body?.message)
      ? body.message.join(", ")
      : (body?.message ?? `Permintaan gagal (${res.status})`);
    throw new Error(msg);
  }
  return body;
}

export function fetchBooks({ status, category, search } = {}) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (category) params.set("category", category);
  if (search) params.set("search", search);
  const qs = params.toString();
  return request(`/books${qs ? `?${qs}` : ""}`);
}

export const fetchStats = () => request("/books/stats");

export const createBook = (data) =>
  request("/books", { method: "POST", body: JSON.stringify(data) });

export const updateBook = (id, data) =>
  request(`/books/${id}`, { method: "PATCH", body: JSON.stringify(data) });

export const deleteBook = (id) => request(`/books/${id}`, { method: "DELETE" });
