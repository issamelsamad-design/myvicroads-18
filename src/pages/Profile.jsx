import { useNavigate } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import MenuItem from '@/components/MenuItem';

const SectionCard = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

const SectionHeader = ({ title }) => (
  <div className="px-5 py-4 border-b border-gray-100">
    <h2 className="text-base font-semibold text-gray-900">{title}</h2>
  </div>
);

export default function Profile() {
  const navigate = useNavigate();

  const handleFeedback = () => {
    window.open('https://d6tizftlrpuof.cloudfront.net/live/i/5eb8d0a8935ddb3aab0f27c1/3d686d0a7985acd86e65e167b22fff89e38d9299.html?reset', '_blank');
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-gray-50 px-5 py-6">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
      </div>

      <div className="px-4 space-y-6">
        {/* Profile and settings */}
        <SectionCard>
          <SectionHeader title="Profile and settings" />
          <MenuItem 
            title="Personal information" 
            onClick={() => navigate('/profile/personal-info')} 
            showChevron={false}
          />
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

        {/* App controls */}
        <SectionCard>
          <SectionHeader title="App controls" />
          <MenuItem 
            title="Biometrics and settings" 
            subtitle="Enable biometrics and deactivate card or account"
            onClick={() => navigate('/profile/biometrics')} 
            showChevron={true}
          />
          <MenuItem 
            title="Help and info" 
            onClick={() => navigate('/profile/help')} 
            showChevron={true}
          />
          <MenuItem 
            title="Provide app feedback" 
            onClick={handleFeedback}
            rightIcon={<ExternalLink className="w-4 h-4 text-gray-400" />}
            showChevron={false}
          />
        </SectionCard>
      </div>
    </div>
  );
}
