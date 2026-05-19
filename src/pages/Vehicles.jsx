import { motion } from 'framer-motion';
import MenuItem from '../components/vicroads/MenuItem';

const menuItems = [
  { title: 'Manage registration renewal', subtitle: "Renew your registration when it's due" },
  { title: 'Change your garage address', subtitle: null },
  { title: 'Apprentice registration discount', subtitle: null },
  { title: 'Unregistered vehicle permits', subtitle: null },
  { title: 'My vehicle reports', subtitle: null },
];

export default function Vehicles() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-5 pt-8 pb-8"
    >
      <h1 className="text-[28px] font-bold text-foreground mb-6">Vehicles</h1>

      {/* My registered vehicles card */}
      <div className="bg-card rounded-2xl p-5 shadow-sm border border-border mb-5">
        <p className="text-muted-foreground text-[15px]">No registered vehicles</p>
      </div>

      {/* Actions card */}
      <div className="bg-card rounded-2xl px-5 shadow-sm border border-border">
        {menuItems.map((item, idx) => (
          <div key={idx}>
            {idx > 0 && <div className="border-t border-border" />}
            <MenuItem title={item.title} subtitle={item.subtitle} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}