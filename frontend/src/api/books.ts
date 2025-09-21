import { api } from './client';
import {
  Book,
  CreateBookDto,
  UpdateBookDto,
  SearchBookDto,
  BookSearchResult,
  BorrowBookDto,
  ReturnBookDto,
  BookBorrowRecord,
  ApiResponse,
  PaginatedResponse,
} from '../types/book';

const BOOKS_ENDPOINT = '/books';
const FILES_ENDPOINT = '/files';

// Mock data storage for demo purposes
let mockBooks: Book[] = [
  {
    id: '1',
    title: 'Sample Book 1',
    author: 'Author 1',
    isbn: '978-0123456789',
    year: 2023,
    quantity: 5,
    availableQuantity: 3,
    description: 'A sample book description',
    category: 'Fiction',
    coverImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iIzM0OThmZiIvPjx0ZXh0IHg9IjEwMCIgeT0iMTI1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+U2FtcGxlIEJvb2sgMTwvdGV4dD48L3N2Zz4=',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'George Book',
    author: 'Author 2',
    isbn: '978-0987654321',
    year: 2022,
    quantity: 3,
    availableQuantity: 1,
    description: 'Another sample book',
    category: 'Non-Fiction',
    coverImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iIzEwYjk4MSIvPjx0ZXh0IHg9IjEwMCIgeT0iMTI1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+U2FtcGxlIEJvb2sgMjwvdGV4dD48L3N2Zz4=',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const booksApi = {
  getBooks: async (params?: SearchBookDto): Promise<BookSearchResult> => {
    try {
      const responseData = await api.get<any>(`${BOOKS_ENDPOINT}?${new URLSearchParams(params as any).toString()}`);

      // Backend returns { success: true, data: books, pagination: {...} }
      const { data: books, pagination } = responseData;

      return {
        books,
        total: pagination.total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: pagination.totalPages,
      };
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  },

  getBook: async (id: string): Promise<Book> => {
    try {
      const responseData = await api.get<any>(`${BOOKS_ENDPOINT}/${id}`);
      return responseData.data;
    } catch (error) {
      console.error('Error fetching book:', error);
      throw error;
    }
  },

  createBook: async (bookData: CreateBookDto): Promise<Book> => {
    try {
      const responseData = await api.post<any>(`${BOOKS_ENDPOINT}`, bookData);
      return responseData.data;
    } catch (error) {
      console.error('Error creating book:', error);
      throw error;
    }
  },

  updateBook: async (id: string, bookData: Partial<UpdateBookDto>): Promise<Book> => {
    try {
      const responseData = await api.patch<any>(`${BOOKS_ENDPOINT}/${id}`, bookData);
      return responseData.data;
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  },

  deleteBook: async (id: string): Promise<void> => {
    try {
      await api.delete(`${BOOKS_ENDPOINT}/${id}`);
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  },

  borrowBook: async (bookId: string, borrowData: Omit<BorrowBookDto, 'bookId'>): Promise<BookBorrowRecord> => {
    try {
      const response = await api.post<ApiResponse<BookBorrowRecord>>(`${BOOKS_ENDPOINT}/${bookId}/borrow`, borrowData);
      return response.data;
    } catch (error) {
      console.error('Error borrowing book:', error);
      throw error;
    }
  },

  returnBook: async (bookId: string, returnData: Omit<ReturnBookDto, 'bookId'>): Promise<BookBorrowRecord> => {
    try {
      const response = await api.post<ApiResponse<BookBorrowRecord>>(`${BOOKS_ENDPOINT}/${bookId}/return`, returnData);
      return response.data;
    } catch (error) {
      console.error('Error returning book:', error);
      throw error;
    }
  },

  uploadCover: async (bookId: string, file: File): Promise<{ coverUrl: string }> => {
    try {
      const response = await api.uploadCoverFile<{ message: string; coverImagePath: string }>(`${BOOKS_ENDPOINT}/${bookId}/upload-cover`, file);
      return { coverUrl: response.coverImagePath };
    } catch (error) {
      console.error('Error uploading cover:', error);
      throw error;
    }
  },

  uploadCoverImage: async (file: File): Promise<{ coverUrl: string }> => {
    try {
      const response = await api.uploadFile<{ message: string; coverImage: string }>(`${BOOKS_ENDPOINT}/upload-cover`, file);
      return { coverUrl: response.coverImage };
    } catch (error) {
      console.error('Error uploading cover image:', error);
      throw error;
    }
  },

  getBorrowHistory: async (bookId: string): Promise<BookBorrowRecord[]> => {
    try {
      const response = await api.get<ApiResponse<BookBorrowRecord[]>>(`${BOOKS_ENDPOINT}/${bookId}/borrow-history`);
      return response.data;
    } catch (error) {
      console.error('Error fetching borrow history:', error);
      throw error;
    }
  },

  getReturnedBooks: async (): Promise<BookBorrowRecord[]> => {
    try {
      const response = await api.get<ApiResponse<BookBorrowRecord[]>>(`${BOOKS_ENDPOINT}/returned/list`);
      return response.data;
    } catch (error) {
      console.error('Error fetching returned books:', error);
      throw error;
    }
  },

  getBorrowedBooks: async (): Promise<BookBorrowRecord[]> => {
    try {
      const response = await api.get<ApiResponse<BookBorrowRecord[]>>(`${BOOKS_ENDPOINT}/borrowed/list`);
      return response.data;
    } catch (error) {
      console.error('Error fetching borrowed books:', error);
      throw error;
    }
  },
};

export default booksApi;