import React, { useState, useEffect } from 'react';
import { Book } from '../types/book';
import { booksApi } from '../api/books';
import { Search, BookOpen, Users, Calendar, ArrowLeft, ArrowRight, X, History } from 'lucide-react';
import BorrowBookModal from './BorrowBookModal';
import ReturnBookModal from './ReturnBookModal';
import BorrowHistory from './BorrowHistory';

interface UserBooksViewProps {
  className?: string;
}

const UserBooksView: React.FC<UserBooksViewProps> = ({ className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid');
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedBookForAction, setSelectedBookForAction] = useState<Book | null>(null);
  const booksPerPage = 8;

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const response = await booksApi.getBooks();
      setBooks(response.books);
      setFilteredBooks(response.books);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(0);
    
    if (!query.trim()) {
      setFilteredBooks(books);
      return;
    }

    const filtered = books.filter(book => 
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase()) ||
      book.isbn.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredBooks(filtered);
  };

  const handleBorrowBook = (book: Book) => {
    setSelectedBookForAction(book);
    setShowBorrowModal(true);
  };

  const handleReturnBook = (book: Book) => {
    setSelectedBookForAction(book);
    setShowReturnModal(true);
  };

  const handleShowHistory = (book: Book) => {
    setSelectedBookForAction(book);
    setShowHistoryModal(true);
  };

  const onBorrowSuccess = () => {
    setShowBorrowModal(false);
    setSelectedBookForAction(null);
    fetchBooks(); // Refresh the list
  };

  const onReturnSuccess = () => {
    setShowReturnModal(false);
    setSelectedBookForAction(null);
    fetchBooks(); // Refresh the list
  };

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const startIndex = currentPage * booksPerPage;
  const currentBooks = filteredBooks.slice(startIndex, startIndex + booksPerPage);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const totalBooks = books.length;
  const borrowedBooks = books.filter(book => book.quantity > (book.availableQuantity || book.quantity)).length;
  const availableBooks = books.filter(book => (book.availableQuantity || book.quantity) > 0).length;

  useEffect(() => {
    fetchBooks();
  }, []);

  const BookCard = ({ book }: { book: Book }) => (
    <div className="group cursor-pointer transform transition-all duration-300 hover:scale-105">
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
        {/* Book Cover */}
        <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
          {book.coverImage ? (
            <img
              src={book.coverImage.startsWith('http') ? book.coverImage : `http://localhost:3000${book.coverImage}`}
              alt={`${book.title} cover`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={`absolute inset-0 flex items-center justify-center ${book.coverImage ? 'hidden' : ''}`}>
            <BookOpen size={48} className="text-gray-400" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
            <h3 className="text-white font-semibold text-sm line-clamp-2">{book.title}</h3>
          </div>
        </div>
        
        {/* Book Info */}
        <div className="p-4">
          <p className="text-gray-600 text-sm mb-2 line-clamp-1">{book.author}</p>
          <p className="text-xs text-gray-500 mb-3">ISBN: {book.isbn}</p>
          
          {/* Availability */}
          <div className="flex items-center justify-between mb-4">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              (book.availableQuantity ?? book.quantity) > 0 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {(book.availableQuantity ?? book.quantity) > 0 ? 'Available' : 'Borrowed'}
            </span>
            <span className="text-xs text-gray-500">
              {book.availableQuantity ?? book.quantity}/{book.quantity}
            </span>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedBook(book)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Details
            </button>
            {(book.availableQuantity ?? book.quantity) > 0 ? (
              <button
                onClick={() => handleBorrowBook(book)}
                className="flex-1 bg-black hover:bg-gray-800 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Borrow
              </button>
            ) : (
              <button
                onClick={() => handleReturnBook(book)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Return
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light text-gray-900 mb-6">Library</h1>
          <p className="text-lg text-gray-600 font-light">Discover and borrow books</p>
        </div>

        {/* Minimal Search */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search books, authors, ISBN..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-gray-50 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all duration-300 text-lg"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-12 mb-16 text-center">
          <div>
            <div className="text-3xl font-light text-gray-900">{totalBooks}</div>
            <div className="text-sm text-gray-500 uppercase tracking-wide">Total Books</div>
          </div>
          <div>
            <div className="text-3xl font-light text-gray-900">{availableBooks}</div>
            <div className="text-sm text-gray-500 uppercase tracking-wide">Available</div>
          </div>
          <div>
            <div className="text-3xl font-light text-gray-900">{borrowedBooks}</div>
            <div className="text-sm text-gray-500 uppercase tracking-wide">Borrowed</div>
          </div>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : (
          <>
            {/* Books Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
              {currentBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <ArrowLeft size={20} />
                </button>
                <span className="text-gray-600 font-light">
                  {currentPage + 1} of {totalPages}
                </span>
                <button
                  onClick={nextPage}
                  disabled={currentPage >= totalPages - 1}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Book Detail Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
            <div className="p-8">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-light text-gray-900">Book Details</h2>
                <button
                  onClick={() => setSelectedBook(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Book Cover */}
                <div className="w-32 h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg relative overflow-hidden">
                  {selectedBook.coverImage ? (
                    <img
                      src={selectedBook.coverImage.startsWith('http') ? selectedBook.coverImage : `http://localhost:3000${selectedBook.coverImage}`}
                      alt={`${selectedBook.title} cover`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`absolute inset-0 flex items-center justify-center ${selectedBook.coverImage ? 'hidden' : ''}`}>
                    <BookOpen size={64} className="text-gray-400" />
                  </div>
                </div>

                {/* Book Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedBook.title}</h3>
                    <p className="text-gray-600">{selectedBook.author}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">ISBN:</span>
                      <span className="text-gray-900">{selectedBook.isbn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Copies:</span>
                      <span className="text-gray-900">{selectedBook.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Available:</span>
                      <span className="text-gray-900">{selectedBook.availableQuantity ?? selectedBook.quantity}</span>
                    </div>
                  </div>

                  {/* Availability Status */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        (selectedBook.availableQuantity ?? selectedBook.quantity) > 0 ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <span className="font-medium">
                        {(selectedBook.availableQuantity ?? selectedBook.quantity) > 0 ? 'Available for borrowing' : 'Currently borrowed'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-4">
                    {(selectedBook.availableQuantity ?? selectedBook.quantity) > 0 ? (
                      <button
                        onClick={() => {
                          handleBorrowBook(selectedBook);
                          setSelectedBook(null);
                        }}
                        className="flex-1 bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        Borrow Book
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          handleReturnBook(selectedBook);
                          setSelectedBook(null);
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        Return Book
                      </button>
                    )}
                    <button
                      onClick={() => {
                        handleShowHistory(selectedBook);
                        setSelectedBook(null);
                      }}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <History className="w-4 h-4" />
                      History
                    </button>
                    <button
                      onClick={() => setSelectedBook(null)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Borrow Book Modal */}
      <BorrowBookModal
        book={selectedBookForAction}
        isOpen={showBorrowModal}
        onClose={() => {
          setShowBorrowModal(false);
          setSelectedBookForAction(null);
        }}
        onSuccess={onBorrowSuccess}
      />

      {/* Return Book Modal */}
      <ReturnBookModal
        book={selectedBookForAction}
        isOpen={showReturnModal}
        onClose={() => {
          setShowReturnModal(false);
          setSelectedBookForAction(null);
        }}
        onSuccess={onReturnSuccess}
      />

      {/* Borrow History Modal */}
      <BorrowHistory
        book={selectedBookForAction}
        isOpen={showHistoryModal}
        onClose={() => {
          setShowHistoryModal(false);
          setSelectedBookForAction(null);
        }}
      />
    </div>
  );
};

export default UserBooksView;