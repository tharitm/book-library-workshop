import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import { ToastProvider } from './contexts/ToastContext'

function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-noto-thai">
        <Navbar />
        <div className="pt-20 container mx-auto px-4 py-6">
          <Outlet />
        </div>
      </div>
    </ToastProvider>
  );
}

export default App