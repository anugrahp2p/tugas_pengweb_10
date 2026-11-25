import { ReadingStatus } from '@prisma/client';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export const CATEGORIES = [
  'Filsafat',
  'Sejarah',
  'Sains & Teknologi',
  'Ekonomi',
  'Sastra',
] as const;

export const STATUSES = ['rencana', 'sedang', 'selesai'] as const;

export class CreateBookDto {
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  title: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  author: string;

  @IsOptional()
  @IsIn(CATEGORIES)
  category?: string;

  @IsInt()
  @Min(1)
  @Max(2100)
  year: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100000)
  pages?: number;

  @IsOptional()
  @IsIn(STATUSES)
  status?: ReadingStatus;

  @IsOptional()
  @IsString()
  @Matches(
    /^(https?:\/\/.+|data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=]+)$/,
    {
      message:
        'coverUrl harus berupa URL http(s) yang valid atau file gambar yang diunggah',
    },
  )
  @MaxLength(500000)
  coverUrl?: string;
}