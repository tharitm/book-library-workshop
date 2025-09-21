import React from 'react';
import { Book } from '../types/book';
import { Eye, Edit, Download, Upload, Trash2 } from 'lucide-react';

interface BookTableProps {
  books?: Book[];
  onBookSelect?: (book: Book) => void;
  onEditBook?: (book: Book) => void;
  onDeleteBook?: (bookId: string) => void;
  onBorrowBook?: (bookId: string) => void;
  onReturnBook?: (bookId: string) => void;
}

const BookTable: React.FC<BookTableProps> = ({ 
  books = [], 
  onBookSelect, 
  onEditBook, 
  onDeleteBook,
  onBorrowBook,
  onReturnBook
}) => {
  if (books.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No books available</h3>
        <p className="text-gray-500">Start by adding some books to your library.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                ปก
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                ชื่อหนังสือ
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                ผู้แต่ง
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                หมวดหมู่
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                ปี
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                สถานะ
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {books.map((book, index) => (
              <tr key={book.id} className={`transition-colors duration-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                <td className="px-6 py-5 whitespace-nowrap border-b border-gray-100">
                  <div className="flex-shrink-0 h-16 w-12">
                    {book.coverImage ? (
                      <img
                        className="h-16 w-12 object-cover rounded-lg border border-gray-200 shadow-sm"
                        src={book.coverImage.startsWith('http') ? book.coverImage : `http://localhost:3000${book.coverImage}`}
                        alt={`${book.title} cover`}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA0OCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzMkwyNCAzMiIgc3Ryb2tlPSIjOUI5QkEwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K';
                        }}
                      />
                    ) : (
                      <div className="h-16 w-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                        <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap border-b border-gray-100">
                  <div className="text-sm font-semibold text-gray-900 mb-1">{book.title}</div>
                  <div className="text-xs text-gray-500">ISBN: {book.isbn}</div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700 border-b border-gray-100">
                  {book.author}
                </td>
                <td className="px-6 py-5 whitespace-nowrap border-b border-gray-100">
                  <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200">
                    {book.category}
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-700 border-b border-gray-100">
                  {book.year}
                </td>
                <td className="px-6 py-5 whitespace-nowrap border-b border-gray-100">
                  <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${
                    (book.availableQuantity ?? book.quantity) > 0 
                      ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-200' 
                      : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-200'
                  }`}>
                    {book.availableQuantity ?? book.quantity}/{book.quantity}
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap border-b border-gray-100">
                  <div className="flex justify-center space-x-1">
                    <button
                      onClick={() => onBookSelect?.(book)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 group"
                      title="ดูรายละเอียด"
                    >
                      <Eye size={16} className="group-hover:scale-110 transition-transform duration-200" />
                    </button>
                    <button
                      onClick={() => onEditBook?.(book)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 transition-all duration-200 group"
                      title="แก้ไข"
                    >
                      <Edit size={16} className="group-hover:scale-110 transition-transform duration-200" />
                    </button>
                    {(book.availableQuantity ?? book.quantity) > 0 && (
                      <button
                        onClick={() => onBorrowBook?.(book.id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 transition-all duration-200 group"
                        title="ยืมหนังสือ"
                      >
                        <Download size={16} className="group-hover:scale-110 transition-transform duration-200" />
                      </button>
                    )}
                    {(book.availableQuantity ?? book.quantity) < book.quantity && (
                      <button
                        onClick={() => onReturnBook?.(book.id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 hover:text-orange-700 transition-all duration-200 group"
                        title="คืนหนังสือ"
                      >
                        <Upload size={16} className="group-hover:scale-110 transition-transform duration-200" />
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteBook?.(book.id)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200 group"
                      title="ลบหนังสือ"
                    >
                      <Trash2 size={16} className="group-hover:scale-110 transition-transform duration-200" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookTable;