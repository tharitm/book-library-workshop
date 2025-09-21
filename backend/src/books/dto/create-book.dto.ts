import { IsString, IsNumber, IsOptional, IsNotEmpty, Length, Min, Max, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ description: 'Book title', example: 'The Great Gatsby' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 500)
  title: string;

  @ApiProperty({ description: 'Book author', example: 'F. Scott Fitzgerald' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 200)
  author: string;

  @ApiProperty({ description: 'ISBN number', example: '978-0-7432-7356-5' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/, {
    message: 'Invalid ISBN format'
  })
  isbn: string;

  @ApiProperty({ description: 'Publication year', example: 1925 })
  @IsNumber()
  @Min(1000)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @ApiProperty({ description: 'Total quantity', example: 5 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({ description: 'Book description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Book category', example: 'Fiction' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  category?: string;

  @ApiPropertyOptional({ description: 'Publisher name' })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  publisher?: string;

  @ApiPropertyOptional({ description: 'Book language', example: 'Thai' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  language?: string;

  @ApiPropertyOptional({ description: 'Number of pages', example: 180 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  pages?: number;

  @ApiPropertyOptional({ description: 'Cover image URL or path', example: '/uploads/covers/book-cover.jpg' })
  @IsOptional()
  @IsString()
  coverImage?: string;
}