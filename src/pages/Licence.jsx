import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LicenceCard from '../components/vicroads/LicenceCard';
import MenuItem from '../components/vicroads/MenuItem';

const menuItems = [
  { title: 'View demerit points', subtitle: null },
  { title: 'Manage licence renewal', subtitle: "Renew your licence when it's due" },
  { title: 'Order driver history report', subtitle: null },
  { title: 'Update address on licence', subtitle: null },
  { title: 'Access myLearners', subtitle: null },
  { title: 'Replace licence', subtitle: null },
];

export default function Licence() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-5 pt-8 pb-8 min-h-screen bg-[#ebebf0]"
    >
      <h1 className="text-[28px] font-bold text-foreground mb-6">Licence</h1>

      <LicenceCard onClick={() => navigate('/licence-details')} compact />

      <div className="bg-white rounded-2xl px-5 shadow-sm mt-4">
        {menuItems.map((item, idx) => (
          <div key={idx}>
            {idx > 0 && <div className="border-t border-gray-100" />}
            <MenuItem
              title={item.title}
              subtitle={item.subtitle}
              onClick={() => {
                if (item.title === 'View demerit points') navigate('/demerit-points');
              }}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}