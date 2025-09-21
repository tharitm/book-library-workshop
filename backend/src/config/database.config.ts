import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { Book } from '../books/entities/book.entity';
import { BorrowRecord } from '../books/entities/borrow-record.entity';
import { User } from '../auth/entities/user.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: join(process.cwd(), 'db.sqlite'),
  entities: [Book, BorrowRecord, User],
  synchronize: true, // Only for development
  logging: process.env.NODE_ENV === 'development',
  autoLoadEntities: true,
};