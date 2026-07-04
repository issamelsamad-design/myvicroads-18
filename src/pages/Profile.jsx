import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ExternalLink, Fingerprint, HelpCircle } from 'lucide-react';
import PersonalInfoModal from '@/components/PersonalInfoModal';
import AddressesModal from '@/components/AddressesModal';
import SecuritySettingsModal from '@/components/SecuritySettingsModal';

const SectionCard = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    {children}
  </div>
);

const SectionHeader = ({ title }) => (
  <div className="px-5 py-4 border-b border-slate-100">
    <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
  </div>
);

const MenuItem = ({ title, subtitle, onClick, showChevron = true, icon }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
  >
    <div className="flex items-center gap-3 flex-1">
      {icon && <div className="text-slate-400">{icon}</div>}
      <div className="flex-1 text-left">
        <p className="text-[15px] font-medium text-slate-900">{title}</p>
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
  const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState(false);
  const [isAddressesOpen, setIsAddressesOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <div className="bg-slate-50 px-5 py-6">
        <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
      </div>

      <div className="px-4 space-y-6">
        <SectionCard>
          <SectionHeader title="Profile and settings" />
          <MenuItem 
            title="Personal information" 
            onClick={() => setIsPersonalInfoOpen(true)} 
            showChevron={false}
          />
          <MenuItem 
            title="Addresses" 
            onClick={() => setIsAddressesOpen(true)} 
            showChevron={false}
          />
          <MenuItem 
            title="Security settings" 
            onClick={() => setIsSecurityOpen(true)} 
            showChevron={false}
          />
          <MenuItem 
            title="Passkey settings" 
            onClick={() => navigate('/profile/passkeys')} 
            showChevron={true}
          />
        </SectionCard>

        <SectionCard>
          <SectionHeader title="App controls" />
          <MenuItem 
            title="Biometrics and settings" 
            subtitle="Enable biometrics and deactivate card or account"
            onClick={() => navigate('/profile/biometrics')} 
            icon={<Fingerprint className="w-5 h-5" />}
          />
          <MenuItem 
            title="Help and info" 
            onClick={() => navigate('/profile/help')} 
            icon={<HelpCircle className="w-5 h-5" />}
          />
          <MenuItem 
            title="Provide app feedback" 
            onClick={() => navigate('/profile/feedback')} 
            showChevron={false}
            icon={<ExternalLink className="w-5 h-5 text-slate-400" />}
          />
        </SectionCard>
      </div>

      <PersonalInfoModal 
        isOpen={isPersonalInfoOpen} 
        onClose={() => setIsPersonalInfoOpen(false)} 
      />
      <AddressesModal 
        isOpen={isAddressesOpen} 
        onClose={() => setIsAddressesOpen(false)} 
      />
      <SecuritySettingsModal 
        isOpen={isSecurityOpen} 
        onClose={() => setIsSecurityOpen(false)} 
      />
    </div>
  );
}
