import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';

// Semua field opsional -> cocok untuk PATCH.
export class UpdateBookDto extends PartialType(CreateBookDto) {}
