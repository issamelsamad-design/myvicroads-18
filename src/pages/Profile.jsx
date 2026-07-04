import { useNavigate } from 'react-router-dom';
import { ChevronRight, ExternalLink, LogOut, Fingerprint } from 'lucide-react';

const SectionCard = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    {children}
  </div>
);

const MenuItem = ({ title, subtitle, onClick, showChevron = true, icon, danger = false }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 ${
      danger ? 'text-red-600' : ''
    }`}
  >
    <div className="flex items-center gap-3 flex-1">
      {icon && <div className={danger ? 'text-red-600' : 'text-slate-400'}>{icon}</div>}
      <div className="flex-1 text-left">
        <p className={`text-[15px] font-medium ${danger ? 'text-red-600' : 'text-slate-900'}`}>
          {title}
        </p>
        {subtitle && (
          <p className="text-[13px] text-slate-500 mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
    {showChevron && <ChevronRight className="w-5 h-5 text-slate-400" />}
  </button>
);

export default function Profile() {
  const navigate = useNavigate();

  const handleFeedback = () => {
    window.open('https://d6tizftlrpuof.cloudfront.net/live/i/5eb8d0a8935ddb3aab0f27c1/3d686d0a7985acd86e65e167b22fff89e38d9299.html?reset', '_blank');
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      // Add your logout logic here
      navigate('/login');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <div className="bg-slate-50 px-5 py-6">
        <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
      </div>

      <div className="px-4 space-y-6">
        <SectionCard>
          <MenuItem 
            title="Addresses" 
            onClick={() => navigate('/profile/addresses')} 
            showChevron={false}
          />
          <MenuItem 
            title="Security settings" 
            onClick={() => navigate('/profile/security')} 
            showChevron={false}
          />
          <MenuItem 
            title="Passkey settings" 
            onClick={() => navigate('/profile/passkeys')} 
            showChevron={true}
          />
        </SectionCard>

        <SectionCard>
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900">App controls</h2>
          </div>
          <MenuItem 
            title="Biometrics and settings" 
            subtitle="Enable biometrics and deactivate card or account"
            onClick={() => navigate('/profile/biometrics')} 
            icon={<Fingerprint className="w-5 h-5" />}
          />
          <MenuItem 
            title="Help and info" 
            onClick={() => navigate('/profile/help')} 
          />
          <MenuItem 
            title="Provide app feedback" 
            onClick={handleFeedback}
            showChevron={false}
            icon={<ExternalLink className="w-5 h-5 text-slate-400" />}
          />
        </SectionCard>

        <SectionCard>
          <MenuItem 
            title="Log out" 
            onClick={handleLogout}
            showChevron={false}
            icon={<LogOut className="w-5 h-5" />}
            danger={true}
          />
        </SectionCard>

        <p className="text-center text-sm text-slate-500 pb-4">
          App version 1.3.5
        </p>
      </div>
    </div>
  );
}
