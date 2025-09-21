import { useState, useEffect } from 'react';
import { Menu, LogOut, Home, Book, BookOpen, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const handleHomeClick = () => {
    navigate('/books')
  }

  const handleBooksClick = () => {
    navigate('/books')
  }



  const handleBorrowedBooksClick = () => {
    navigate('/borrowed-books')
  }

  const handleReturnHistoryClick = () => {
    navigate('/return-history')
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
      ? 'bg-white/90 backdrop-blur-lg shadow-sm'
      : 'bg-white'
      }`}>
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-md font-bold text-gray-800">
              📚 Book Library
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-6">
            {/* Home Icon */}
            <button
              onClick={handleHomeClick}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-all duration-200"
              title="หน้าหลัก"
            >
              <Home size={20} />
            </button>

            {/* Books Icon */}
            <button
              onClick={handleBooksClick}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-all duration-200"
              title="หนังสือ"
            >
              <Book size={20} />
            </button>



            {/* Borrowed Books Icon */}
            <button
              onClick={handleBorrowedBooksClick}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-all duration-200"
              title="หนังสือที่ถูกยืมอยู่"
            >
              <BookOpen size={20} />
            </button>

            {/* Return History Icon */}
            <button
              onClick={handleReturnHistoryClick}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-all duration-200"
              title="ประวัติการคืนหนังสือ"
            >
              <History size={20} />
            </button>

            {/* Menu (Mobile) */}
            <button className="md:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-all duration-200">
              <Menu size={20} />
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 group"
              title="ออกจากระบบ"
            >
              <LogOut size={20} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;