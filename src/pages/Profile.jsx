import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import MenuItem from '../components/vicroads/MenuItem';

const profileSettings = [
  { title: 'Personal information', subtitle: null },
  { title: 'Addresses', subtitle: null },
  { title: 'Security settings', subtitle: null },
  { title: 'Passkey settings', subtitle: null, showChevron: true },
];

const appControls = [
  { title: 'Biometrics and settings', subtitle: 'Enable biometrics and deactivate card or account', showChevron: true },
  { title: 'Help and info', subtitle: null, showChevron: true, path: '/help-and-info' },
  { title: 'Provide app feedback', subtitle: null, rightIcon: <ExternalLink className="w-4 h-4 text-muted-foreground" /> },
];

export default function Profile() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-5 pt-8 pb-8 min-h-screen bg-[#ebebf0]"
    >
      <h1 className="text-[28px] font-bold text-foreground mb-6">Profile</h1>

      {/* Profile and settings */}
      <div className="mb-4">
        <div className="bg-white rounded-2xl px-5 shadow-sm">
          <p className="text-[15px] font-bold text-gray-900 pt-5 pb-3">Profile and settings</p>
          {profileSettings.map((item, idx) => (
            <div key={idx}>
              <div className="border-t border-gray-100" />
              <MenuItem
                title={item.title}
                subtitle={item.subtitle}
                showChevron={item.showChevron}
                onClick={item.path ? () => navigate(item.path) : undefined}
              />
            </div>
          ))}
        </div>
      </div>

      {/* App controls */}
      <div>
        <div className="bg-white rounded-2xl px-5 shadow-sm">
          <p className="text-[15px] font-bold text-gray-900 pt-5 pb-3">App controls</p>
          {appControls.map((item, idx) => (
            <div key={idx}>
              <div className="border-t border-gray-100" />
              <MenuItem
                title={item.title}
                subtitle={item.subtitle}
                showChevron={item.showChevron}
                rightIcon={item.rightIcon}
                onClick={item.path ? () => navigate(item.path) : undefined}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}