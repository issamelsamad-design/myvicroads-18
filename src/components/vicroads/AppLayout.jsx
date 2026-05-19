import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav.jsx';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#ebebf0] max-w-lg mx-auto relative">
      <div className="pb-20">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}