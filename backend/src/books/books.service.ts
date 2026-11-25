import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { QueryBooksDto } from './dto/query-books.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  // READ (list) + filter lanjutan via `where`
  findAll(query: QueryBooksDto = {}) {
    const { status, category, search } = query;
    const where: Prisma.BookWhereInput = {
      ...(status && { status }),
      ...(category && { category }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { author: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };
    return this.prisma.book.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  // READ (satu data)
  async findOne(id: string) {
    const book = await this.prisma.book.findUnique({ where: { id } });
    if (!book) throw new NotFoundException(`Buku ${id} tidak ditemukan`);
    return book;
  }

  // CREATE
  create(dto: CreateBookDto) {
    return this.prisma.book.create({ data: dto });
  }

  // UPDATE
  async update(id: string, dto: UpdateBookDto) {
    try {
      return await this.prisma.book.update({ where: { id }, data: dto });
    } catch (error) {
      this.rethrowNotFound(error, id);
    }
  }

  // DELETE
  async remove(id: string) {
    try {
      await this.prisma.book.delete({ where: { id } });
    } catch (error) {
      this.rethrowNotFound(error, id);
    }
  }

  // Statistik sederhana dengan count()
  async getStats() {
    const [total, selesai, sedang, rencana] = await this.prisma.$transaction([
      this.prisma.book.count(),
      this.prisma.book.count({ where: { status: 'selesai' } }),
      this.prisma.book.count({ where: { status: 'sedang' } }),
      this.prisma.book.count({ where: { status: 'rencana' } }),
    ]);
    return { total, selesai, sedang, rencana };
  }

  // P2025 = record tidak ditemukan -> terjemahkan ke 404 milik NestJS
  private rethrowNotFound(error: unknown, id: string): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new NotFoundException(`Buku ${id} tidak ditemukan`);
    }
    throw error;
  }
}
