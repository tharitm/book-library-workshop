import AdminBooksView from '../components/AdminBooksView';
import UserBooksView from '../components/UserBooksView';
import { useAuth } from '../contexts/AuthContext';

function Books() {
  const { user } = useAuth();

  // แสดง component ตาม role ของ user
  if (user?.role === 'admin') {
    return (
      <div className="container mx-auto px-6 py-8">
        <AdminBooksView />
      </div>
    );
  }

  // Default สำหรับ user หรือ role อื่นๆ
  return (
    <div className="container mx-auto px-6 py-8">
      <UserBooksView />
    </div>
  );
}

export default Books;