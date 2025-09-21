import { DataSource } from 'typeorm';
import { Book } from '../books/entities/book.entity';
import { BorrowRecord, BorrowStatus, BookCondition } from '../books/entities/borrow-record.entity';
import { User, UserRole } from '../auth/entities/user.entity';

export async function seedDatabase(dataSource: DataSource) {
  const bookRepository = dataSource.getRepository(Book);
  const borrowRecordRepository = dataSource.getRepository(BorrowRecord);
  const userRepository = dataSource.getRepository(User);

  // Clear existing data
  await borrowRecordRepository.clear();
  await bookRepository.clear();
  await userRepository.clear();

  // Seed users
  const users = [
    {
      username: 'admin',
      email: 'admin@library.com',
      password: 'admin123',
      role: UserRole.ADMIN,
    },
    {
      username: 'user',
      email: 'user@library.com',
      password: 'user123',
      role: UserRole.USER,
    },
  ];

  const savedUsers = await userRepository.save(users);

  const books = [
    {
      title: 'สามก๊ก',
      author: 'ลัวกวนจง',
      isbn: '978-974-286-123-4',
      year: 1925,
      quantity: 5,
      availableQuantity: 3,
      description: 'นวนิยายประวัติศาสตร์จีนที่เล่าเรื่องราวในยุคสามก๊ก',
      category: 'นวนิยายประวัติศาสตร์',
      publisher: 'สำนักพิมพ์แสงแดด',
      language: 'Thai',
      pages: 1200,
      coverImage: '/uploads/covers/samkok.jpg',
    },
    {
      title: 'เพชรพระอุมา',
      author: 'ครูเหลียม',
      isbn: '978-974-286-124-1',
      year: 1937,
      quantity: 3,
      availableQuantity: 2,
      description: 'นวนิยายรักคลาสสิกไทยที่เล่าเรื่องความรักของเพชรและพระอุมา',
      category: 'นวนิยายรัก',
      publisher: 'โรงพิมพ์ไทย',
      language: 'Thai',
      pages: 456,
      coverImage: '/uploads/covers/petch-phra-uma.jpg',
    },
    {
      title: 'คู่กรรม',
      author: 'ทมยันตี',
      isbn: '978-974-286-125-8',
      year: 1973,
      quantity: 4,
      availableQuantity: 4,
      description: 'นวนิยายที่เล่าเรื่องราวความรักและชะตากรรมของคู่รัก',
      category: 'นวนิยายรัก',
      publisher: 'สำนักพิมพ์บรรณกิจ',
      language: 'Thai',
      pages: 380,
      coverImage: '/uploads/covers/kuu-kam.jpg',
    },
    {
      title: 'ผู้ชนะสิบทิศ',
      author: 'อัศนี-วสันต์',
      isbn: '978-974-286-126-5',
      year: 1986,
      quantity: 2,
      availableQuantity: 1,
      description: 'นวนิยายผจญภัยที่เล่าเรื่องการต่อสู้เพื่อความยุติธรรม',
      category: 'นวนิยายผจญภัย',
      publisher: 'สำนักพิมพ์ดอกหญ้า',
      language: 'Thai',
      pages: 520,
      coverImage: '/uploads/covers/phu-chana-sip-thit.jpg',
    },
    {
      title: 'กรรมพุทธศาสนา',
      author: 'พระธรรมปิฎก (ป.อ. ปยุตฺโต)',
      isbn: '978-974-286-127-2',
      year: 1995,
      quantity: 3,
      availableQuantity: 2,
      description: 'หนังสือธรรมะที่อธิบายเรื่องกรรมในพุทธศาสนาอย่างละเอียด',
      category: 'ธรรมะ',
      publisher: 'สำนักพิมพ์สุขภาพใจ',
      language: 'Thai',
      pages: 280,
      coverImage: '/uploads/covers/kam-phutthasasana.jpg',
    },
  ];

  const savedBooks = await bookRepository.save(books);

  const borrowRecords = [
    {
      borrowerName: 'สมชาย ใจดี',
      borrowerEmail: 'somchai@example.com',
      borrowDate: new Date('2024-01-15'),
      expectedReturnDate: new Date('2024-02-15'),
      status: BorrowStatus.BORROWED,
      book: savedBooks[0], // สามก๊ก
      bookId: savedBooks[0].id,
    },
    {
      borrowerName: 'สมหญิง รักการอ่าน',
      borrowerEmail: 'somying@example.com',
      borrowDate: new Date('2024-01-10'),
      expectedReturnDate: new Date('2024-02-10'),
      actualReturnDate: new Date('2024-02-08'),
      condition: BookCondition.GOOD,
      status: BorrowStatus.RETURNED,
      book: savedBooks[1], // เพชรพระอุมา
      bookId: savedBooks[1].id,
    },
    {
      borrowerName: 'วิชัย นักเรียน',
      borrowerEmail: 'wichai@example.com',
      borrowDate: new Date('2024-01-20'),
      expectedReturnDate: new Date('2024-02-20'),
      status: BorrowStatus.BORROWED,
      book: savedBooks[2], // คู่กรรม
      bookId: savedBooks[2].id,
    },
  ];

  const savedBorrowRecords = await borrowRecordRepository.save(borrowRecords);

  console.log('Database seeded successfully!');
  console.log(`Created ${savedUsers.length} users, ${savedBooks.length} books, ${savedBorrowRecords.length} borrow records`);
}