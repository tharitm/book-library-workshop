import { IsString, IsNotEmpty, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookCondition } from '../entities/borrow-record.entity';

export class ReturnBookDto {
  @ApiProperty({ description: 'Return date', example: '2024-02-10T10:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  returnDate: string;

  @ApiPropertyOptional({
    description: 'Book condition upon return',
    enum: BookCondition,
    example: BookCondition.GOOD
  })
  @IsOptional()
  @IsEnum(BookCondition)
  condition?: BookCondition;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}