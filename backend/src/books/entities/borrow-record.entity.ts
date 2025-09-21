import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Book } from './book.entity';

export enum BorrowStatus {
  BORROWED = 'borrowed',
  RETURNED = 'returned',
  OVERDUE = 'overdue'
}

export enum BookCondition {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor'
}

@Entity('borrow_records')
export class BorrowRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  borrowerName: string;

  @Column({ length: 200, nullable: true })
  borrowerEmail?: string;

  @Column('datetime')
  borrowDate: Date;

  @Column('datetime')
  expectedReturnDate: Date;

  @Column('datetime', { nullable: true })
  actualReturnDate?: Date;

  @Column({
    type: 'varchar',
    enum: BookCondition,
    nullable: true
  })
  condition?: BookCondition;

  @Column('text', { nullable: true })
  notes?: string;

  @Column({
    type: 'varchar',
    enum: BorrowStatus,
    default: BorrowStatus.BORROWED
  })
  status: BorrowStatus;

  @ManyToOne(() => Book, book => book.borrowRecords, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @Column('uuid')
  bookId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}