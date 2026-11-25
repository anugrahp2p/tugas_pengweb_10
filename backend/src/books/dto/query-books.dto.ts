import { ReadingStatus } from '@prisma/client';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { CATEGORIES, STATUSES } from './create-book.dto';

export class QueryBooksDto {
  @IsOptional()
  @IsIn(STATUSES)
  status?: ReadingStatus;

  @IsOptional()
  @IsIn(CATEGORIES)
  category?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;
}
