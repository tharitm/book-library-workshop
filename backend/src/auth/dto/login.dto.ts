import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Username', example: 'admin' })
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  username: string;

  @ApiProperty({ description: 'Password', example: 'admin123' })
  @IsNotEmpty()
  @IsString()
  @Length(6, 255)
  password: string;
}