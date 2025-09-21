import React, { useState } from 'react';
import { X, Calendar, User, Mail, BookOpen } from 'lucide-react';
import { Book, BorrowBookDto } from '../types/book';
import { booksApi } from '../api/books';

interface BorrowBookModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const BorrowBookModal: React.FC<BorrowBookModalProps> = ({
  book,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    borrowerName: '',
    borrowerEmail: '',
    borrowDate: new Date().toISOString().split('T')[0],
    expectedReturnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 14 days from now
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;

    try {
      setIsLoading(true);
      setError(null);

      const borrowData: Omit<BorrowBookDto, 'bookId'> = {
        borrowerName: formData.borrowerName,
        borrowerEmail: formData.borrowerEmail || undefined,
        borrowDate: new Date(formData.borrowDate).toISOString(),
        expectedReturnDate: new Date(formData.expectedReturnDate).toISOString()
      };

      await booksApi.borrowBook(book.id, borrowData);
      
      // Reset form
      setFormData({
        borrowerName: '',
        borrowerEmail: '',
        borrowDate: new Date().toISOString().split('T')[0],
        expectedReturnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });

      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Error borrowing book:', error);
      setError(error.response?.data?.message || 'เกิดข้อผิดพลาดในการยืมหนังสือ');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !book) return null;

  const isAvailable = (book.availableQuantity ?? book.quantity) > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <BookOpen size={20} />
            ยืมหนังสือ
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Book Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-1">{book.title}</h3>
            <p className="text-sm text-gray-600">โดย {book.author}</p>
            <p className="text-sm text-gray-600 mt-1">
              คงเหลือ: {book.availableQuantity ?? book.quantity} เล่ม
            </p>
          </div>

          {!isAvailable ? (
            <div className="text-center py-4">
              <p className="text-red-600 font-medium">หนังสือเล่มนี้ไม่มีให้ยืมในขณะนี้</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Borrower Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User size={16} className="inline mr-1" />
                  ชื่อผู้ยืม *
                </label>
                <input
                  type="text"
                  name="borrowerName"
                  value={formData.borrowerName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="กรุณากรอกชื่อผู้ยืม"
                />
              </div>

              {/* Borrower Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail size={16} className="inline mr-1" />
                  อีเมล (ไม่บังคับ)
                </label>
                <input
                  type="email"
                  name="borrowerEmail"
                  value={formData.borrowerEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="example@email.com"
                />
              </div>

              {/* Borrow Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar size={16} className="inline mr-1" />
                  วันที่ยืม *
                </label>
                <input
                  type="date"
                  name="borrowDate"
                  value={formData.borrowDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Expected Return Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar size={16} className="inline mr-1" />
                  วันที่คาดว่าจะคืน *
                </label>
                <input
                  type="date"
                  name="expectedReturnDate"
                  value={formData.expectedReturnDate}
                  onChange={handleInputChange}
                  required
                  min={formData.borrowDate}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'กำลังยืม...' : 'ยืมหนังสือ'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BorrowBookModal;