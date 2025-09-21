import React, { useState, useEffect } from 'react';
import { BookBorrowRecord } from '../types/book';
import { booksApi } from '../api/books';
import { Calendar, User, BookOpen, FileText, Clock, AlertTriangle } from 'lucide-react';

interface BorrowedBooksProps {
  className?: string;
}

const BorrowedBooks: React.FC<BorrowedBooksProps> = ({ className = '' }) => {
  const [borrowedBooks, setBorrowedBooks] = useState<BookBorrowRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBorrowedBooks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await booksApi.getBorrowedBooks();
      setBorrowedBooks(data);
    } catch (error) {
      console.error('Error fetching borrowed books:', error);
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูลหนังสือที่ถูกยืมอยู่');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isOverdue = (expectedReturnDate: string) => {
    return new Date(expectedReturnDate) < new Date();
  };

  const getDaysOverdue = (expectedReturnDate: string) => {
    const today = new Date();
    const returnDate = new Date(expectedReturnDate);
    const diffTime = today.getTime() - returnDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gray-50 ${className}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg text-gray-600">กำลังโหลดข้อมูล...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen bg-gray-50 ${className}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <AlertTriangle className="h-16 w-16 text-red-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">เกิดข้อผิดพลาด</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={fetchBorrowedBooks}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ลองใหม่อีกครั้ง
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">หนังสือที่ถูกยืมอยู่</h1>
          <p className="text-lg text-gray-600 font-light">รายการหนังสือทั้งหมดที่ยังไม่ได้รับการคืน</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-orange-50 rounded-xl p-6 text-center">
            <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-orange-600">{borrowedBooks.length}</h3>
            <p className="text-orange-700">หนังสือที่ถูกยืมอยู่</p>
          </div>
          <div className="bg-red-50 rounded-xl p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-red-600">
              {borrowedBooks.filter(record => isOverdue(record.expectedReturnDate)).length}
            </h3>
            <p className="text-red-700">เกินกำหนดคืน</p>
          </div>
        </div>

        {/* Borrowed Books List */}
        {borrowedBooks.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">ไม่มีหนังสือที่ถูกยืมอยู่</h3>
            <p className="text-gray-500">เมื่อมีการยืมหนังสือ รายการจะแสดงที่นี่</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Group books by unique book ID */}
            {Object.entries(
              borrowedBooks.reduce((groups, record) => {
                const bookId = record.book?.id || 'unknown';
                if (!groups[bookId]) {
                  groups[bookId] = {
                    book: record.book,
                    records: []
                  };
                }
                groups[bookId].records.push(record);
                return groups;
              }, {} as Record<string, { book: any; records: typeof borrowedBooks }>)
            ).map(([bookId, { book, records }]) => (
              <div key={bookId} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Book Header */}
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {book?.coverImage ? (
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="h-16 w-12 object-cover rounded-lg shadow-sm"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`h-16 w-12 rounded-lg bg-orange-100 flex items-center justify-center ${book?.coverImage ? 'hidden' : ''}`}>
                          <BookOpen className="h-6 w-6 text-orange-600" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {book?.title || 'ไม่ระบุชื่อหนังสือ'}
                        </h3>
                        <p className="text-sm text-gray-600">โดย {book?.author || 'ไม่ระบุผู้แต่ง'}</p>
                        <p className="text-xs text-gray-500 mt-1">ISBN: {book?.isbn || 'ไม่ระบุ'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-600">{records.length}</div>
                      <div className="text-sm text-gray-600">ครั้งที่ยืม</div>
                    </div>
                  </div>
                </div>

                {/* Borrow Records */}
                <div className="divide-y divide-gray-100">
                  {records.map((record, index) => {
                    const overdue = isOverdue(record.expectedReturnDate);
                    const daysOverdue = overdue ? getDaysOverdue(record.expectedReturnDate) : 0;
                    
                    return (
                      <div key={record.id} className={`px-6 py-4 hover:bg-gray-50 transition-colors ${overdue ? 'bg-red-50' : ''}`}>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          {/* Borrower Info */}
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${overdue ? 'bg-red-100' : 'bg-purple-100'}`}>
                                <User className={`h-4 w-4 ${overdue ? 'text-red-600' : 'text-purple-600'}`} />
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {record.borrowerName}
                              </div>
                              {record.borrowerEmail && (
                                <div className="text-xs text-gray-500">
                                  {record.borrowerEmail}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Dates */}
                          <div className="space-y-1">
                            <div className="flex items-center text-xs text-gray-600">
                              <Calendar className="h-3 w-3 mr-1" />
                              ยืม: {formatDate(record.borrowDate)}
                            </div>
                            <div className={`flex items-center text-xs ${overdue ? 'text-red-600' : 'text-gray-600'}`}>
                              <Clock className="h-3 w-3 mr-1" />
                              ครบกำหนด: {formatDate(record.expectedReturnDate)}
                            </div>
                          </div>

                          {/* Status */}
                          <div className="flex items-center">
                            {overdue ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                เกินกำหนด {daysOverdue} วัน
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <Clock className="h-3 w-3 mr-1" />
                                ยังไม่ครบกำหนด
                              </span>
                            )}
                          </div>

                          {/* Notes */}
                          <div className="flex items-start">
                            <FileText className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                            <div className="text-xs text-gray-600 max-w-xs">
                              {record.notes || 'ไม่มีหมายเหตุ'}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowedBooks;