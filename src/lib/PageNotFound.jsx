import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

export default function PageNotFound() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const pageName = location.pathname.substring(1);

  return (
    <div className="min-h-screen bg-[#f2f2f7] flex flex-col items-center justify-center px-5 text-center">
      <div className="text-6xl mb-4">🚗</div>
      <h1 className="text-[24px] font-bold text-gray-900 mb-2">Page not found</h1>
      <p className="text-[14px] text-gray-500 mb-6">
        {pageName ? `"/${pageName}" doesn't exist.` : "This page doesn't exist."}
      </p>
      <button
        onClick={() => navigate(isAuthenticated ? '/home' : '/login')}
        className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-semibold text-[15px]"
      >
        Go home
      </button>
    </div>
  );
}
