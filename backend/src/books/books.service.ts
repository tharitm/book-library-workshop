import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions } from 'typeorm';
import { Book } from './entities/book.entity';
import { BorrowRecord, BorrowStatus } from './entities/borrow-record.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { SearchBookDto } from './dto/search-book.dto';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { ReturnBookDto } from './dto/return-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(BorrowRecord)
    private readonly borrowRecordRepository: Repository<BorrowRecord>,
  ) { }

  async create(createBookDto: CreateBookDto): Promise<Book> {
    // Check if ISBN already exists
    const existingBook = await this.bookRepository.findOne({
      where: { isbn: createBookDto.isbn }
    });

    if (existingBook) {
      throw new ConflictException('Book with this ISBN already exists');
    }

    const book = this.bookRepository.create({
      ...createBookDto,
      availableQuantity: createBookDto.quantity,
    });

    return await this.bookRepository.save(book);
  }

  async findAll(searchDto: SearchBookDto): Promise<{ books: Book[]; total: number; page: number; limit: number; totalPages: number }> {
    const { page = 1, limit = 10, sortBy = 'title', sortOrder = 'asc', ...filters } = searchDto;

    const queryBuilder = this.bookRepository.createQueryBuilder('book');

    // Apply filters
    if (filters.title) {
      queryBuilder.andWhere('book.title LIKE :title', { title: `%${filters.title}%` });
    }
    if (filters.author) {
      queryBuilder.andWhere('book.author LIKE :author', { author: `%${filters.author}%` });
    }
    if (filters.isbn) {
      queryBuilder.andWhere('book.isbn LIKE :isbn', { isbn: `%${filters.isbn}%` });
    }
    if (filters.category) {
      queryBuilder.andWhere('book.category LIKE :category', { category: `%${filters.category}%` });
    }
    if (filters.year) {
      queryBuilder.andWhere('book.year = :year', { year: filters.year });
    }

    // Apply sorting
    queryBuilder.orderBy(`book.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC');

    // Apply pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [books, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return {
      books,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['borrowRecords'],
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);

    // If ISBN is being updated, check for conflicts
    if (updateBookDto.isbn && updateBookDto.isbn !== book.isbn) {
      const existingBook = await this.bookRepository.findOne({
        where: { isbn: updateBookDto.isbn }
      });

      if (existingBook) {
        throw new ConflictException('Book with this ISBN already exists');
      }
    }

    // If quantity is being updated, adjust available quantity
    if (updateBookDto.quantity !== undefined) {
      const borrowedCount = book.quantity - book.availableQuantity;
      const newAvailableQuantity = updateBookDto.quantity - borrowedCount;

      if (newAvailableQuantity < 0) {
        throw new BadRequestException('Cannot reduce quantity below borrowed amount');
      }

      book.availableQuantity = newAvailableQuantity;
    }

    Object.assign(book, updateBookDto);
    return await this.bookRepository.save(book);
  }

  async remove(id: string): Promise<void> {
    const book = await this.findOne(id);

    // Check if book has active borrows
    const activeBorrows = await this.borrowRecordRepository.count({
      where: { bookId: id, status: BorrowStatus.BORROWED }
    });

    if (activeBorrows > 0) {
      throw new BadRequestException('Cannot delete book with active borrows');
    }

    await this.bookRepository.remove(book);
  }

  async borrow(id: string, borrowData: BorrowBookDto): Promise<BorrowRecord> {
    const book = await this.findOne(id);

    if (book.availableQuantity <= 0) {
      throw new BadRequestException('Book is not available for borrowing');
    }

    // Create borrow record
    const borrowRecord = this.borrowRecordRepository.create({
      ...borrowData,
      bookId: id,
      borrowDate: new Date(borrowData.borrowDate),
      expectedReturnDate: new Date(borrowData.expectedReturnDate),
      status: BorrowStatus.BORROWED,
    });

    // Update book availability
    book.availableQuantity -= 1;

    // Save both in transaction
    await this.bookRepository.manager.transaction(async manager => {
      await manager.save(book);
      await manager.save(borrowRecord);
    });

    return borrowRecord;
  }

  async returnBook(id: string, returnData: ReturnBookDto): Promise<BorrowRecord> {
    const book = await this.findOne(id);

    // Find the most recent active borrow record
    const borrowRecord = await this.borrowRecordRepository.findOne({
      where: { bookId: id, status: BorrowStatus.BORROWED },
      order: { borrowDate: 'DESC' }
    });

    if (!borrowRecord) {
      throw new NotFoundException('No active borrow record found for this book');
    }

    // Update borrow record
    borrowRecord.actualReturnDate = new Date(returnData.returnDate);
    borrowRecord.condition = returnData.condition;
    borrowRecord.notes = returnData.notes;
    borrowRecord.status = BorrowStatus.RETURNED;

    // Update book availability
    book.availableQuantity += 1;

    // Save both in transaction
    await this.bookRepository.manager.transaction(async manager => {
      await manager.save(book);
      await manager.save(borrowRecord);
    });

    return borrowRecord;
  }

  async getBorrowHistory(id: string): Promise<BorrowRecord[]> {
    await this.findOne(id); // Ensure book exists

    return await this.borrowRecordRepository.find({
      where: { bookId: id },
      order: { borrowDate: 'DESC' }
    });
  }



  async getBorrowedBooks(): Promise<BorrowRecord[]> {
    return await this.borrowRecordRepository.find({
      where: { status: BorrowStatus.BORROWED },
      relations: ['book'],
      order: { borrowDate: 'DESC' },
    });
  }

  async getReturnedBooks(): Promise<BorrowRecord[]> {
    return await this.borrowRecordRepository.find({
      where: { status: BorrowStatus.RETURNED },
      relations: ['book'],
      order: { actualReturnDate: 'DESC' },
    });
  }

  async updateCoverImage(id: string, coverImagePath: string): Promise<Book> {
    const book = await this.findOne(id); // This will throw NotFoundException if book doesn't exist
    
    book.coverImage = coverImagePath;
    return await this.bookRepository.save(book);
  }

  async recalculateAvailableQuantities(): Promise<void> {
    // Get all books
    const books = await this.bookRepository.find();
    
    for (const book of books) {
      // Count active borrows for this book
      const activeBorrowsCount = await this.borrowRecordRepository.count({
        where: { bookId: book.id, status: BorrowStatus.BORROWED }
      });
      
      // Calculate correct available quantity
      const correctAvailableQuantity = book.quantity - activeBorrowsCount;
      
      // Update if different
      if (book.availableQuantity !== correctAvailableQuantity) {
        book.availableQuantity = correctAvailableQuantity;
        await this.bookRepository.save(book);
      }
    }
  }

  async fixSpecificBookQuantity(bookId: string): Promise<Book> {
    const book = await this.findOne(bookId);
    
    // Count active borrows for this book
    const activeBorrowsCount = await this.borrowRecordRepository.count({
      where: { bookId: book.id, status: BorrowStatus.BORROWED }
    });
    
    // Calculate correct available quantity
    const correctAvailableQuantity = book.quantity - activeBorrowsCount;
    
    // Update available quantity
    book.availableQuantity = correctAvailableQuantity;
    return await this.bookRepository.save(book);
  }
}