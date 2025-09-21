// Book-related TypeScript type definitions

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

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  year: number;
  quantity: number;
  availableQuantity?: number;
  coverImage?: string;
  description?: string;
  category?: string;
  publisher?: string;
  language?: string;
  pages?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookDto {
  title: string;
  author: string;
  isbn: string;
  year: number;
  quantity: number;
  description?: string;
  category?: string;
  publisher?: string;
  language?: string;
  pages?: number;
  coverImage?: string;
}

export interface UpdateBookDto extends Partial<CreateBookDto> {
  id: string;
}

export interface SearchBookDto {
  title?: string;
  author?: string;
  isbn?: string;
  category?: string;
  year?: number;
  page?: number;
  limit?: number;
  sortBy?: 'title' | 'author' | 'year' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface BookSearchResult {
  books: Book[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BorrowBookDto {
  bookId: string;
  borrowerName: string;
  borrowerEmail?: string;
  borrowDate: string;
  expectedReturnDate: string;
}

export interface ReturnBookDto {
  bookId: string;
  returnDate: string;
  condition?: BookCondition;
  notes?: string;
}

export interface BookBorrowRecord {
  id: string;
  bookId: string;
  borrowerName: string;
  borrowerEmail?: string;
  borrowDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string;
  condition?: BookCondition;
  notes?: string;
  status: BorrowStatus;
  createdAt: string;
  updatedAt: string;
  book?: Book; // Optional book relation
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

// Form state types
export interface BookFormState {
  book: Partial<Book>;
  isLoading: boolean;
  errors: Record<string, string>;
  isValid: boolean;
}

export interface BookListState {
  books: Book[];
  isLoading: boolean;
  error: string | null;
  searchParams: SearchBookDto;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error types
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface NetworkError {
  message: string;
  status?: number;
  timeout?: boolean;
}

// Validation schemas (basic structure)
export interface BookValidationSchema {
  title: {
    required: boolean;
    minLength: number;
    maxLength: number;
  };
  author: {
    required: boolean;
    minLength: number;
    maxLength: number;
  };
  isbn: {
    required: boolean;
    pattern: RegExp;
  };
  year: {
    required: boolean;
    min: number;
    max: number;
  };
}

// Filter and sort types
export interface BookFilter {
  category?: string;
  author?: string;
  year?: number;
  availability?: 'available' | 'borrowed' | 'all';
  rating?: number;
}

export interface BookSort {
  field: 'title' | 'author' | 'year' | 'category' | 'createdAt';
  direction: 'asc' | 'desc';
}

export interface BookQuery {
  search?: string;
  filter?: BookFilter;
  sort?: BookSort;
  page?: number;
  limit?: number;
}

// Book status types
export type BookStatus = 'available' | 'borrowed' | 'reserved' | 'maintenance' | 'lost';

export interface BookStatusInfo {
  status: BookStatus;
  borrowedBy?: string;
  borrowedDate?: string;
  expectedReturnDate?: string;
  reservedBy?: string;
  reservedDate?: string;
  maintenanceReason?: string;
  lastUpdated: string;
}

// Extended book interface with status
export interface BookWithStatus extends Book {
  status: BookStatusInfo;
  borrowHistory?: BookBorrowRecord[];
  averageRating?: number;
  totalReviews?: number;
}