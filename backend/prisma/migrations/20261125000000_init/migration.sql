-- CreateEnum
CREATE TYPE "ReadingStatus" AS ENUM ('rencana', 'sedang', 'selesai');

-- CreateTable
CREATE TABLE "books" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Filsafat',
    "year" INTEGER NOT NULL,
    "pages" INTEGER NOT NULL DEFAULT 0,
    "status" "ReadingStatus" NOT NULL DEFAULT 'rencana',
    "coverUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);
