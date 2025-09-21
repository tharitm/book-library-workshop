import { Plus, Search } from 'lucide-react';
import BookTable from './BookTable';
import AddBookModal from './AddBookModal';
import BookDetail from './BookDetail';
import InputModal from './InputModal';
import { useState, useEffect } from 'react';
import { Book, BookCondition } from '../types/book';
import { booksApi } from '../api/books';
import { useToast } from '../contexts/ToastContext';

interface AdminBooksViewProps {
  className?: string;
}

function AdminBooksView({ className = '' }: AdminBooksViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [inputModal, setInputModal] = useState<{
    isOpen: boolean;
    title: string;
    placeholder: string;
    onConfirm: (value: string) => void;
  }>({
    isOpen: false,
    title: '',
    placeholder: '',
    onConfirm: () => { },
  });
  const { showSuccess, showError } = useToast();

  const handleAddBook = () => {
    setEditingBook(null);
    setIsModalOpen(true);
  };

  const fetchBooks = async (search?: string) => {
    setIsLoading(true);
    try {
      const params = search ? { title: search } : undefined;
      const result = await booksApi.getBooks(params);
      setBooks(result.books);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchBooks(query);
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบหนังสือเล่มนี้?')) {
      return;
    }

    try {
      await booksApi.deleteBook(bookId);
      fetchBooks(searchQuery);
      showSuccess('ลบหนังสือสำเร็จ!', 'หนังสือได้ถูกลบออกจากระบบแล้ว');
    } catch (error) {
      console.error('Error deleting book:', error);
      showError('เกิดข้อผิดพลาดในการลบหนังสือ', 'กรุณาลองใหม่อีกครั้ง');
    }
  };

  const handleBookAdded = () => {
    fetchBooks(searchQuery);
  };

  const handleBorrowBook = async (bookId: string) => {
    setInputModal({
      isOpen: true,
      title: 'ยืมหนังสือ',
      placeholder: 'กรุณาใส่ชื่อผู้ยืม',
      onConfirm: async (borrowerName: string) => {
        try {
          const borrowData = {
            borrowerName,
            borrowDate: new Date().toISOString(),
            expectedReturnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          };

          await booksApi.borrowBook(bookId, borrowData);
          fetchBooks(searchQuery);
          showSuccess('ยืมหนังสือสำเร็จ!', `ผู้ยืม: ${borrowerName}`);
          setInputModal(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error('Error borrowing book:', error);
          showError('เกิดข้อผิดพลาดในการยืมหนังสือ', 'กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง');
        }
      },
    });
  };

  const handleReturnBook = async (bookId: string) => {
    setInputModal({
      isOpen: true,
      title: 'คืนหนังสือ',
      placeholder: 'กรุณาใส่ชื่อผู้คืน',
      onConfirm: async (borrowerName: string) => {
        try {
          await booksApi.returnBook(bookId, {
            returnDate: new Date().toISOString(),
            condition: BookCondition.GOOD
          });
          showSuccess('คืนหนังสือเรียบร้อยแล้ว!', `ผู้คืน: ${borrowerName}`);
          fetchBooks(searchQuery);
          setInputModal(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error('Error returning book:', error);
          showError('เกิดข้อผิดพลาดในการคืนหนังสือ', 'กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง');
        }
      },
    });
  };

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    setIsDetailOpen(true);
  };

  const handleDetailClose = () => {
    setIsDetailOpen(false);
    setSelectedBook(null);
  };

  const handleDetailEdit = (book: Book) => {
    setEditingBook(book);
    setIsModalOpen(true);
    setIsDetailOpen(false);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const totalBooks = books.length;
  const borrowedBooks = books.reduce((total, book) => total + (book.quantity - (book.availableQuantity || book.quantity)), 0);
  const availableBooks = books.reduce((total, book) => total + (book.availableQuantity || book.quantity), 0);

  return (
    <div className={`min-h-screen bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light text-gray-900 mb-6">Admin Dashboard</h1>
          <p className="text-lg text-gray-600 font-light">จัดการหนังสือในระบบห้องสมุด</p>
        </div>

        {/* Search Section with Add Button */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="ค้นหาหนังสือ, ผู้แต่ง, ISBN..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all duration-300 text-lg"
              />
            </div>
            <button
              onClick={handleAddBook}
              className="flex items-center space-x-2 px-6 py-4 bg-black hover:bg-gray-800 text-white rounded-full transition-colors duration-200 font-medium"
            >
              <Plus size={20} />
              <span>เพิ่มหนังสือ</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-12 mb-16 text-center">
          <div>
            <div className="text-3xl font-light text-gray-900">{totalBooks}</div>
            <div className="text-sm text-gray-500 uppercase tracking-wide">หนังสือทั้งหมด</div>
          </div>
          <div>
            <div className="text-3xl font-light text-gray-900">{availableBooks}</div>
            <div className="text-sm text-gray-500 uppercase tracking-wide">พร้อมให้ยืม</div>
          </div>
          <div>
            <div className="text-3xl font-light text-gray-900">{borrowedBooks}</div>
            <div className="text-sm text-gray-500 uppercase tracking-wide">ถูกยืมแล้ว</div>
          </div>
        </div>

        {/* Books Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-8 border-b border-gray-100">
            <h3 className="text-2xl font-light text-gray-900">รายการหนังสือ</h3>
          </div>
          <div className="p-8">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
              </div>
            ) : (
              <BookTable
                books={books}
                onBookSelect={handleBookSelect}
                onEditBook={handleEditBook}
                onDeleteBook={handleDeleteBook}
                onBorrowBook={handleBorrowBook}
                onReturnBook={handleReturnBook}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddBookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBookAdded={handleBookAdded}
        editingBook={editingBook}
      />

      <BookDetail
        book={selectedBook}
        isOpen={isDetailOpen}
        onClose={handleDetailClose}
        onEdit={handleDetailEdit}
        onBorrow={handleBorrowBook}
        onReturn={handleReturnBook}
      />

      <InputModal
        isOpen={inputModal.isOpen}
        title={inputModal.title}
        placeholder={inputModal.placeholder}
        onConfirm={inputModal.onConfirm}
        onCancel={() => setInputModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

export default AdminBooksView;