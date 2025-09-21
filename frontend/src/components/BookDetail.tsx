import React from 'react';
import { X, Calendar, User, BookOpen, Hash, Building, Globe, FileText } from 'lucide-react';
import { Book } from '../types/book';

interface BookDetailProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (book: Book) => void;
  onBorrow?: (bookId: string) => void;
  onReturn?: (bookId: string) => void;
}

const BookDetail: React.FC<BookDetailProps> = ({
  book,
  isOpen,
  onClose,
  onEdit,
  onBorrow,
  onReturn
}) => {
  if (!isOpen || !book) return null;

  const isAvailable = (book.availableQuantity ?? book.quantity) > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-semibold text-gray-900">รายละเอียดหนังสือ</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cover Image */}
            <div className="lg:col-span-1">
              <div className="aspect-[3/4] w-full max-w-sm mx-auto">
                {book.coverImage ? (
                  <img
                    src={book.coverImage.startsWith('http') ? book.coverImage : `http://localhost:3000${book.coverImage}`}
                    alt={`${book.title} cover`}
                    className="w-full h-full object-cover rounded-lg border border-gray-200 shadow-md"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iI0YzRjRGNiIvPjx0ZXh0IHg9IjEwMCIgeT0iMTI1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5QjlCQTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBDb3ZlcjwvdGV4dD48L3N2Zz4=';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-lg border border-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <p className="text-gray-500">ไม่มีรูปปก</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Availability Status */}
              <div className="mt-6 text-center">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  isAvailable 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    isAvailable ? 'bg-green-400' : 'bg-red-400'
                  }`}></div>
                  {isAvailable ? 'พร้อมให้ยืม' : 'ไม่พร้อมให้ยืม'}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  มีอยู่ {book.availableQuantity ?? book.quantity} จาก {book.quantity} เล่ม
                </p>
              </div>
            </div>

            {/* Book Information */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Title and Author */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                  <div className="flex items-center text-lg text-gray-600 mb-4">
                    <User className="w-5 h-5 mr-2" />
                    <span>โดย {book.author}</span>
                  </div>
                  {book.category && (
                    <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                      {book.category}
                    </span>
                  )}
                </div>

                {/* Book Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Hash className="w-5 h-5 mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">ISBN</p>
                        <p className="text-gray-900">{book.isbn}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">ปีที่พิมพ์</p>
                        <p className="text-gray-900">{book.year}</p>
                      </div>
                    </div>

                    {book.publisher && (
                      <div className="flex items-center">
                        <Building className="w-5 h-5 mr-3 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">สำนักพิมพ์</p>
                          <p className="text-gray-900">{book.publisher}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {book.language && (
                      <div className="flex items-center">
                        <Globe className="w-5 h-5 mr-3 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">ภาษา</p>
                          <p className="text-gray-900">{book.language}</p>
                        </div>
                      </div>
                    )}

                    {book.pages && book.pages > 0 && (
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 mr-3 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">จำนวนหน้า</p>
                          <p className="text-gray-900">{book.pages} หน้า</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center">
                      <BookOpen className="w-5 h-5 mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">จำนวนทั้งหมด</p>
                        <p className="text-gray-900">{book.quantity} เล่ม</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {book.description && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">เรื่องย่อ</h3>
                    <p className="text-gray-700 leading-relaxed">{book.description}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-6 border-t">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(book)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      แก้ไขข้อมูล
                    </button>
                  )}
                  
                  {onBorrow && isAvailable && (
                    <button
                      onClick={() => onBorrow(book.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      ยืมหนังสือ
                    </button>
                  )}
                  
                  {onReturn && !isAvailable && (
                    <button
                      onClick={() => onReturn(book.id)}
                      className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                    >
                      คืนหนังสือ
                    </button>
                  )}
                </div>

                {/* Timestamps */}
                <div className="text-sm text-gray-500 pt-4 border-t">
                  <p>เพิ่มเมื่อ: {new Date(book.createdAt).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                  <p>อัปเดตล่าสุด: {new Date(book.updatedAt).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;