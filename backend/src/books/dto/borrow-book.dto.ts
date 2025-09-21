import { IsString, IsNotEmpty, IsOptional, IsDateString, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BorrowBookDto {
  @ApiProperty({ description: 'Borrower name', example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 200)
  borrowerName: string;

  @ApiPropertyOptional({ description: 'Borrower email', example: 'john@example.com' })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  borrowerEmail?: string;

  @ApiProperty({ description: 'Borrow date', example: '2024-01-15T10:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  borrowDate: string;

  @ApiProperty({ description: 'Expected return date', example: '2024-02-15T10:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  expectedReturnDate: string;
}