import React, { useState } from 'react';
import { X, Calendar, BookOpen, Star, FileText } from 'lucide-react';
import { Book, ReturnBookDto, BookCondition } from '../types/book';
import { booksApi } from '../api/books';

interface ReturnBookModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ReturnBookModal: React.FC<ReturnBookModalProps> = ({
  book,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    returnDate: new Date().toISOString().split('T')[0],
    condition: BookCondition.GOOD,
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

      const returnData: Omit<ReturnBookDto, 'bookId'> = {
        returnDate: new Date(formData.returnDate).toISOString(),
        condition: formData.condition,
        notes: formData.notes || undefined
      };

      await booksApi.returnBook(book.id, returnData);
      
      // Reset form
      setFormData({
        returnDate: new Date().toISOString().split('T')[0],
        condition: BookCondition.GOOD,
        notes: ''
      });

      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Error returning book:', error);
      setError(error.response?.data?.message || 'เกิดข้อผิดพลาดในการคืนหนังสือ');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !book) return null;

  const conditionOptions = [
    { value: BookCondition.EXCELLENT, label: 'ดีเยี่ยม', color: 'text-green-600' },
    { value: BookCondition.GOOD, label: 'ดี', color: 'text-blue-600' },
    { value: BookCondition.FAIR, label: 'พอใช้', color: 'text-yellow-600' },
    { value: BookCondition.POOR, label: 'แย่', color: 'text-red-600' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <BookOpen size={20} />
            คืนหนังสือ
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
            <p className="text-sm text-gray-600 mt-1">ISBN: {book.isbn}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Return Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar size={16} className="inline mr-1" />
                วันที่คืน *
              </label>
              <input
                type="date"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleInputChange}
                required
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Book Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Star size={16} className="inline mr-1" />
                สภาพหนังสือ *
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {conditionOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>ดีเยี่ยม: ไม่มีรอยขีดข่วน</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>ดี: รอยขีดข่วนเล็กน้อย</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>พอใช้: มีรอยขีดข่วนบ้าง</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>แย่: เสียหายมาก</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FileText size={16} className="inline mr-1" />
                หมายเหตุ (ไม่บังคับ)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="เช่น หนังสือมีรอยขีดข่วนที่หน้า 10, มีรอยน้ำ เป็นต้น"
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
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'กำลังคืน...' : 'คืนหนังสือ'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReturnBookModal;