import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { BorrowRecord } from './borrow-record.entity';

@Entity('books')
@Index(['title', 'author'])
@Index(['isbn'], { unique: true })
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 500 })
  title: string;

  @Column({ length: 200 })
  author: string;

  @Column({ length: 20, unique: true })
  isbn: string;

  @Column('int')
  year: number;

  @Column('int', { default: 1 })
  quantity: number;

  @Column('int', { default: 1 })
  availableQuantity: number;

  @Column('text', { nullable: true })
  description?: string;

  @Column({ length: 100, nullable: true })
  category?: string;

  @Column({ length: 200, nullable: true })
  publisher?: string;

  @Column({ length: 50, nullable: true, default: 'Thai' })
  language?: string;

  @Column('int', { nullable: true })
  pages?: number;

  @Column('text', { nullable: true })
  coverImage?: string;

  @OneToMany(() => BorrowRecord, borrowRecord => borrowRecord.book)
  borrowRecords: BorrowRecord[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}