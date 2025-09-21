import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from './App'
import Login from './pages/Login'
import Books from './pages/Books'
import BookDetail from './pages/BookDetail'
import BookForm from './pages/BookForm'
import BorrowedBooks from './components/BorrowedBooks'
import ReturnHistory from './components/ReturnHistory'
import { useAuth } from './contexts/AuthContext'

// ProtectedRoute component to check authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Navigate to="/books" replace />
          </ProtectedRoute>
        )
      },
      {
        path: 'books',
        element: (
          <ProtectedRoute>
            <Books />
          </ProtectedRoute>
        )
      },
      {
        path: 'books/:id',
        element: (
          <ProtectedRoute>
            <BookDetail />
          </ProtectedRoute>
        )
      },
      {
        path: 'books/:id/edit',
        element: (
          <ProtectedRoute>
            <BookForm />
          </ProtectedRoute>
        )
      },

      {
        path: 'borrowed-books',
        element: (
          <ProtectedRoute>
            <BorrowedBooks />
          </ProtectedRoute>
        )
      },
      {
        path: 'return-history',
        element: (
          <ProtectedRoute>
            <ReturnHistory />
          </ProtectedRoute>
        )
      }
    ]
  }
])