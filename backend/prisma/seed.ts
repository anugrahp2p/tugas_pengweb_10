import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const cover = (isbn: string) =>
  `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`;

async function main() {
  // Seed hanya dijalankan jika tabel masih kosong (aman dijalankan berulang).
  if ((await prisma.book.count()) > 0) {
    console.log('Tabel books sudah berisi data, seed dilewati.');
    return;
  }
  await prisma.book.createMany({
    data: [
      {
        title: 'Fear and Trembling (Ketakutan dan Gemetar)',
        author: 'Søren Kierkegaard',
        category: 'Filsafat',
        year: 1843,
        pages: 160,
        status: 'selesai',
        coverUrl: cover('9780140444490'),
      },
      {
        title:
          'Sapi, Babi, Perang, dan Tukang Sihir: Menjawab Teka-teki Kebudayaan',
        author: 'Marvin Harris',
        category: 'Sejarah',
        year: 1974,
        pages: 300,
        status: 'sedang',
        coverUrl: cover('9789791260886'),
      },
      {
        title: 'Madilog: Materialisme, Dialektika, Logika',
        author: 'Tan Malaka',
        category: 'Filsafat',
        year: 1943,
        pages: 560,
        status: 'rencana',
        coverUrl: cover('9786025792403'),
      },
    ],
  });
  console.log('Seed selesai: 3 buku ditambahkan.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
