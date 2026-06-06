import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { motion } from 'framer-motion';
import LicenceCard from '../components/vicroads/LicenceCard';
import { useLicenceData } from '../lib/licenceData';

export default function Home() {
  const navigate = useNavigate();
  const { data } = useLicenceData();
  const { user } = useAuth();
  const isAdmin = user?.email === 'issamelsamad@icloud.com';
  const greeting = data.firstName && data.firstName.trim() ? data.firstName.trim() : 'User';

  return (
    <div className="flex flex-col px-5 pt-8 pb-4 min-h-screen bg-[#ebebf0]">
      {/* Greeting */}
      <motion.button
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => navigate(isAdmin ? '/admin' : '/edit-details')}
        className="text-left mb-5"
      >
        <h1 className="text-[32px] font-bold text-[#1a1f2e] leading-tight">
          Hi {greeting}
        </h1>
      </motion.button>

      {/* Demerit points card */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onClick={() => navigate('/demerit-points')}
        className="w-full bg-white rounded-2xl p-5 text-left shadow-sm mb-3"
      >
        <div className="flex flex-col gap-3">
          <img
            src="https://media.base44.com/images/public/69ef4a43c358abf10ebfe17a/a09e301ce_Screenshot2026-04-29at53331am.png"
            alt="demerit"
            className="w-16 h-16 object-contain"
          />
          <span className="text-[15px] font-normal text-[#1a1f2e]">Demerit points balance</span>
        </div>
      </motion.button>

      {/* Registered vehicles card */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => navigate('/vehicles')}
        className="w-full bg-white rounded-2xl p-5 text-left shadow-sm mb-3"
      >
        <div className="flex flex-col gap-3">
          <img
            src="https://media.base44.com/images/public/69ef4a43c358abf10ebfe17a/6ba820aff_Screenshot2026-04-29at53339am.png"
            alt="vehicles"
            className="w-16 h-16 object-contain"
          />
          <span className="text-[15px] font-normal text-[#1a1f2e]">Registered vehicles</span>
        </div>
      </motion.button>

      {/* My licence card — fixed at bottom above nav */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="fixed bottom-24 left-0 right-0 max-w-lg mx-auto px-5"
      >
        <LicenceCard onClick={() => navigate('/licence-details')} />
      </motion.div>
    </div>
  );
}