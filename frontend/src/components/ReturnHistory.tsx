import React, { useState, useEffect } from 'react';
import { BookBorrowRecord, BookCondition } from '../types/book';
import { booksApi } from '../api/books';
import { Calendar, User, BookOpen, FileText, CheckCircle, AlertTriangle, Filter } from 'lucide-react';

interface ReturnHistoryProps {
  className?: string;
}

const ReturnHistory: React.FC<ReturnHistoryProps> = ({ className = '' }) => {
  const [returnHistory, setReturnHistory] = useState<BookBorrowRecord[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<BookBorrowRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterCondition, setFilterCondition] = useState<BookCondition | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchReturnHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await booksApi.getReturnedBooks();
      setReturnHistory(data);
      setFilteredHistory(data);
    } catch (error) {
      console.error('Error fetching return history:', error);
      setError('เกิดข้อผิดพลาดในการโหลดประวัติการคืนหนังสือ');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReturnHistory();
  }, []);

  useEffect(() => {
    let filtered = returnHistory;

    // Filter by condition
    if (filterCondition !== 'all') {
      filtered = filtered.filter(record => record.condition === filterCondition);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.book?.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.borrowerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.borrowerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredHistory(filtered);
  }, [returnHistory, filterCondition, searchTerm]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getConditionText = (condition?: BookCondition) => {
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
        return 'ไม่ระบุ';
    }
  };

  const getConditionColor = (condition?: BookCondition) => {
    switch (condition) {
      case BookCondition.EXCELLENT:
        return 'bg-green-100 text-green-800';
      case BookCondition.GOOD:
        return 'bg-blue-100 text-blue-800';
      case BookCondition.FAIR:
        return 'bg-yellow-100 text-yellow-800';
      case BookCondition.POOR:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysLate = (borrowDate: string, expectedReturnDate: string, actualReturnDate: string) => {
    const expected = new Date(expectedReturnDate);
    const actual = new Date(actualReturnDate);
    const diffTime = actual.getTime() - expected.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
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
              onClick={fetchReturnHistory}
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">ประวัติการคืนหนังสือ</h1>
          <p className="text-lg text-gray-600 font-light">ประวัติการคืนหนังสือทั้งหมดเรียงตามลำดับเวลา</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">ค้นหา</label>
              <input
                type="text"
                placeholder="ค้นหาชื่อหนังสือ, ผู้แต่ง, หรือผู้ยืม..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">สภาพหนังสือ</label>
              <select
                value={filterCondition}
                onChange={(e) => setFilterCondition(e.target.value as BookCondition | 'all')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">ทั้งหมด</option>
                <option value={BookCondition.EXCELLENT}>ดีเยี่ยม</option>
                <option value={BookCondition.GOOD}>ดี</option>
                <option value={BookCondition.FAIR}>พอใช้</option>
                <option value={BookCondition.POOR}>แย่</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-green-50 rounded-xl p-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-green-600">{filteredHistory.length}</h3>
            <p className="text-green-700">รายการที่แสดง</p>
          </div>
          <div className="bg-red-50 rounded-xl p-6 text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-red-600">
              {filteredHistory.filter(record => 
                record.actualReturnDate && record.expectedReturnDate &&
                getDaysLate(record.borrowDate, record.expectedReturnDate, record.actualReturnDate) > 0
              ).length}
            </h3>
            <p className="text-red-700">คืนช้า</p>
          </div>
        </div>

        {/* Return History List */}
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">ไม่พบประวัติการคืนหนังสือ</h3>
            <p className="text-gray-500">ลองเปลี่ยนเงื่อนไขการค้นหาหรือกรองข้อมูล</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      หนังสือ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ผู้ยืม
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      วันที่ยืม
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      กำหนดคืน
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      วันที่คืน
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      สภาพ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      สถานะ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      หมายเหตุ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredHistory.map((record) => {
                    const daysLate = record.actualReturnDate && record.expectedReturnDate ? 
                      getDaysLate(record.borrowDate, record.expectedReturnDate, record.actualReturnDate) : 0;
                    
                    return (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {record.book?.coverImage ? (
                                <img
                                  src={record.book.coverImage}
                                  alt={record.book.title}
                                  className="h-10 w-8 object-cover rounded"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                  }}
                                />
                              ) : null}
                              <div className={`h-10 w-8 rounded bg-blue-100 flex items-center justify-center ${record.book?.coverImage ? 'hidden' : ''}`}>
                                <BookOpen className="h-4 w-4 text-blue-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {record.book?.title || 'ไม่ระบุชื่อหนังสือ'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {record.book?.author || 'ไม่ระบุผู้แต่ง'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {record.borrowerName}
                              </div>
                              {record.borrowerEmail && (
                                <div className="text-sm text-gray-500">
                                  {record.borrowerEmail}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            <div className="text-sm text-gray-900">
                              {formatDate(record.borrowDate)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            <div className="text-sm text-gray-900">
                              {formatDate(record.expectedReturnDate)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-gray-400 mr-2" />
                            <div className="text-sm text-gray-900">
                              {record.actualReturnDate ? formatDateTime(record.actualReturnDate) : 'ไม่ระบุ'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConditionColor(record.condition)}`}>
                            {getConditionText(record.condition)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {daysLate > 0 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              คืนช้า {daysLate} วัน
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              ตรงเวลา
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-start">
                            <FileText className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-gray-900 max-w-xs">
                              {record.notes || 'ไม่มีหมายเหตุ'}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReturnHistory;