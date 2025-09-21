import React, { useState, useEffect } from 'react';
import { Book, BookBorrowRecord, BorrowStatus, BookCondition } from '../types/book';
import { booksApi } from '../api/books';
import { Calendar, User, Mail, FileText, Clock, CheckCircle, AlertCircle, X } from 'lucide-react';

interface BorrowHistoryProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const BorrowHistory: React.FC<BorrowHistoryProps> = ({ book, isOpen, onClose, className = '' }) => {
  const [history, setHistory] = useState<BookBorrowRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    if (!book) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const data = await booksApi.getBorrowHistory(book.id);
      setHistory(data);
    } catch (error) {
      console.error('Error fetching borrow history:', error);
      setError('เกิดข้อผิดพลาดในการโหลดประวัติการยืมคืน');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (book && isOpen) {
      fetchHistory();
    }
  }, [book, isOpen]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: BorrowStatus) => {
    switch (status) {
      case BorrowStatus.BORROWED:
        return <Clock size={16} className="text-blue-600" />;
      case BorrowStatus.RETURNED:
        return <CheckCircle size={16} className="text-green-600" />;
      case BorrowStatus.OVERDUE:
        return <AlertCircle size={16} className="text-red-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getStatusText = (status: BorrowStatus) => {
    switch (status) {
      case BorrowStatus.BORROWED:
        return 'กำลังยืม';
      case BorrowStatus.RETURNED:
        return 'คืนแล้ว';
      case BorrowStatus.OVERDUE:
        return 'เกินกำหนด';
      default:
        return status;
    }
  };

  const getStatusColor = (status: BorrowStatus) => {
    switch (status) {
      case BorrowStatus.BORROWED:
        return 'text-blue-600 bg-blue-100';
      case BorrowStatus.RETURNED:
        return 'text-green-600 bg-green-100';
      case BorrowStatus.OVERDUE:
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getConditionText = (condition?: BookCondition) => {
    if (!condition) return '-';
    switch (condition) {
      case BookCondition.EXCELLENT:
        return 'ดีเยี่ยม';
      case BookCondition.GOOD:
        return 'ดี';
      case BookCondition.FAIR:
        return 'พอใช้';
      case BookCondition.POOR:
        return 'แย่';
      default:
        return condition;
    }
  };

  const getConditionColor = (condition?: BookCondition) => {
    if (!condition) return 'text-gray-600 bg-gray-100';
    switch (condition) {
      case BookCondition.EXCELLENT:
        return 'text-green-600 bg-green-100';
      case BookCondition.GOOD:
        return 'text-blue-600 bg-blue-100';
      case BookCondition.FAIR:
        return 'text-yellow-600 bg-yellow-100';
      case BookCondition.POOR:
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (!isOpen || !book) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">กำลังโหลดประวัติ...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchHistory}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Calendar size={20} />
            ประวัติการยืมคืน - {book.title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
              <p>ยังไม่มีประวัติการยืมคืน</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((record) => (
                <div
                  key={record.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(record.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                        {getStatusText(record.status)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      #{record.id.slice(-8)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User size={14} className="text-gray-400" />
                        <span className="font-medium">{record.borrowerName}</span>
                      </div>
                      {record.borrowerEmail && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={14} className="text-gray-400" />
                          <span>{record.borrowerEmail}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} className="text-gray-400" />
                        <span>ยืม: {formatDate(record.borrowDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} className="text-gray-400" />
                        <span>กำหนดคืน: {formatDate(record.expectedReturnDate)}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {record.actualReturnDate && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle size={14} className="text-green-400" />
                          <span>คืนแล้ว: {formatDate(record.actualReturnDate)}</span>
                        </div>
                      )}
                      {record.condition && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-400">สภาพ:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(record.condition)}`}>
                            {getConditionText(record.condition)}
                          </span>
                        </div>
                      )}
                      {record.notes && (
                        <div className="text-sm">
                          <div className="flex items-start gap-2">
                            <FileText size={14} className="text-gray-400 mt-0.5" />
                            <div>
                              <span className="text-gray-600 block">หมายเหตุ:</span>
                              <span className="text-gray-800">{record.notes}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BorrowHistory;