import { Link, useLocation } from 'react-router-dom';

function HomeIcon({ active }) {
  return (
    <img
      src="https://media.base44.com/images/public/69ef4a43c358abf10ebfe17a/eff432922_image.png"
      alt="home"
      className="w-8 h-8 object-contain"
      style={{ opacity: active ? 1 : 0.55 }}
    />
  );
}

function VehiclesIcon({ active }) {
  const carColor = active ? '#2a2a2a' : '#888';
  return (
    <svg width="34" height="26" viewBox="0 0 72 36" fill="none">
      <rect x="1" y="15" width="36" height="16" rx="2.5" fill="none" stroke={carColor} strokeWidth="2"/>
      <path d="M6 15L11 7H29L36 15" fill="none" stroke={carColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="10" cy="31" r="3.5" fill="none" stroke={carColor} strokeWidth="2"/>
      <circle cx="28" cy="31" r="3.5" fill="none" stroke={carColor} strokeWidth="2"/>
      <path d="M42 31 L52 10 L62 31" fill="#5aab2a"/>
      <path d="M50 31 L58 18 L66 31" fill="#3a7d2c"/>
    </svg>
  );
}

function LicenceIcon({ active }) {
  const color = active ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))';
  return (
    <svg width="26" height="20" viewBox="0 0 26 20" fill="none">
      <rect x="1" y="2" width="24" height="16" rx="2.5" stroke={color} strokeWidth="1.8"/>
      <line x1="7" y1="7" x2="14" y2="7" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="7" y1="10" x2="12" y2="10" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="17" y="6" width="5" height="6" rx="1" stroke={color} strokeWidth="1.3"/>
    </svg>
  );
}

function PaymentsIcon({ active }) {
  const color = active ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))';
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.8"/>
      <text x="12" y="16.5" textAnchor="middle" fontSize="11" fontWeight="bold" fill={color} fontFamily="sans-serif">$</text>
    </svg>
  );
}

function ProfileIcon({ active }) {
  const color = active ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))';
  return (
    <svg width="22" height="24" viewBox="0 0 22 24" fill="none">
      <circle cx="11" cy="7" r="4.5" stroke={color} strokeWidth="1.8"/>
      <path d="M1 22c0-5 4.5-8 10-8s10 3 10 8" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

const tabs = [
  { label: 'Home', Icon: HomeIcon, path: '/home' },
  { label: 'Vehicles', Icon: VehiclesIcon, path: '/vehicles' },
  { label: 'Licence', Icon: LicenceIcon, path: '/licence' },
  { label: 'Payments', Icon: PaymentsIcon, path: '/payments' },
  { label: 'Profile', Icon: ProfileIcon, path: '/profile' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="max-w-lg mx-auto flex items-end justify-around pt-2 pb-3">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const { Icon } = tab;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className="flex flex-col items-center gap-1 px-3 min-w-[56px]"
            >
              {isActive ? (
                <div className="bg-primary/10 rounded-full px-3 py-1.5">
                  <Icon active={true} />
                </div>
              ) : (
                <div className="px-3 py-1.5">
                  <Icon active={false} />
                </div>
              )}
              <span className={`text-[11px] font-medium transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}