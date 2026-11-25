// Backend memakai nilai enum: rencana | sedang | selesai.
// UI menampilkan label bahasa Indonesia.
export const STATUS_LABEL = {
  rencana: "Rencana Dibaca",
  sedang: "Sedang Dibaca",
  selesai: "Selesai Dibaca",
};

export const NEXT_STATUS = {
  rencana: "sedang",
  sedang: "selesai",
  selesai: "rencana",
};

export const CATEGORIES = [
  "Filsafat",
  "Sejarah",
  "Sains & Teknologi",
  "Ekonomi",
  "Sastra",
];
