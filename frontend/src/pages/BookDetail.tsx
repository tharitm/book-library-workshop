import React from 'react';
import { useParams } from 'react-router-dom';

interface BookDetailProps {}

const BookDetail: React.FC<BookDetailProps> = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Book Details</h1>
            <button className="text-blue-600 hover:text-blue-800">
              ← Back to Books
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <span className="text-gray-500">Book Cover</span>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Book Title</h2>
                  <p className="text-gray-600">by Author Name</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-700">ISBN:</span>
                    <p className="text-gray-600">978-0123456789</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Category:</span>
                    <p className="text-gray-600">Fiction</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Year:</span>
                    <p className="text-gray-600">2023</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Available:</span>
                    <p className="text-green-600">In Stock</p>
                  </div>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Description:</span>
                  <p className="text-gray-600 mt-2">
                    Book description will be displayed here when data is loaded.
                  </p>
                </div>
                
                <div className="flex space-x-4 mt-6">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                    Borrow Book
                  </button>
                  <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300">
                    Add to Wishlist
                  </button>
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