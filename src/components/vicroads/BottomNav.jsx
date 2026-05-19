import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

function VicRoadsV({ active }) {
  return (
    <img
      src="https://media.base44.com/images/public/69ff2070757a0b2ea8afc443/8fba784b1_unnamed.png"
      alt="Home"
      style={{ width: 26, height: 26, objectFit: 'contain', opacity: active ? 1 : 0.45 }}
    />
  );
}

function VehiclesIcon({ active }) {
  return (
    <svg width="24" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#1a1a2e' : '#6b7280'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="9" width="22" height="9" rx="2" />
      <path d="M4 9l2.5-4h11L20 9" />
      <circle cx="7" cy="18" r="1.5" />
      <circle cx="17" cy="18" r="1.5" />
    </svg>
  );
}

function LicenceIcon({ active }) {
  return (
    <svg width="24" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#ffffff' : '#6b7280'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <line x1="6" y1="14.5" x2="9" y2="14.5" />
      <line x1="12" y1="14.5" x2="18" y2="14.5" />
    </svg>
  );
}

function PaymentsIcon({ active }) {
  return (
    <svg width="24" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#1a1a2e' : '#6b7280'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v2m0 8v2M9 9h4.5a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3H15" />
    </svg>
  );
}

function ProfileIcon({ active }) {
  return (
    <svg width="24" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#1a1a2e' : '#6b7280'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

const tabs = [
  { label: 'Home', Icon: VicRoadsV, path: '/home' },
  { label: 'Vehicles', Icon: VehiclesIcon, path: '/vehicles' },
  { label: 'Licence', Icon: LicenceIcon, path: '/licence' },
  { label: 'Payments', Icon: PaymentsIcon, path: '/payments' },
  { label: 'Profile', Icon: ProfileIcon, path: '/profile' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl max-w-lg mx-auto">
      <div className="flex items-end pt-1 pb-6 border-t border-gray-200">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path ||
            (tab.path === '/home' && location.pathname === '/');
          const { Icon } = tab;
          const isLicence = tab.path === '/licence';

          return (
           <Link
             key={tab.path}
             to={tab.path}
             className="flex-1 flex flex-col items-center pt-2 pb-1 gap-0.5 relative"
           >
             {isLicence && isActive ? (
               <motion.div 
                 className="w-14 h-9 flex items-center justify-center rounded-2xl" 
                 style={{ backgroundColor: '#1a3a2e' }}
                 animate={{ scale: [1, 1.1, 1] }}
                 transition={{ duration: 0.3 }}
               >
                 <Icon active={true} />
               </motion.div>
             ) : isActive ? (
               <motion.div 
                 className="w-14 h-9 flex items-center justify-center relative"
                 animate={{ scale: [1, 1.05, 1] }}
                 transition={{ duration: 0.3 }}
               >
                 <motion.div
                   className="absolute inset-0 rounded-2xl"
                   style={{ backgroundColor: '#22c55e' }}
                   initial={{ opacity: 0 }}
                   animate={{ opacity: [0.3, 0.6, 0] }}
                   transition={{ duration: 0.3 }}
                 />
                 <Icon active={isActive} />
               </motion.div>
             ) : (
               <div className="w-14 h-9 flex items-center justify-center">
                 <Icon active={false} />
               </div>
             )}
             <span className={`text-[11px] ${isActive ? 'text-primary font-semibold' : 'text-gray-500 font-normal'}`}>
               {tab.label}
             </span>
           </Link>
          );
        })}
      </div>
    </nav>
  );
}