import { motion } from 'framer-motion';
import MenuItem from '../components/vicroads/MenuItem';

const menuItems = [
  { title: 'Manage payment methods', subtitle: 'Store your credit card and bank account details to make payments' },
  { title: 'Direct debit payments', subtitle: 'Manage direct debit settings' },
  { title: 'Transaction history', subtitle: 'View recent transactions made using your myVicRoads account' },
];

export default function Payments() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-5 pt-8 pb-8 min-h-screen bg-[#ebebf0]"
    >
      <h1 className="text-[28px] font-bold text-foreground mb-6">Payments</h1>

      <div className="bg-white rounded-2xl px-5 shadow-sm">
        {menuItems.map((item, idx) => (
          <div key={idx}>
            {idx > 0 && <div className="border-t border-gray-100" />}
            <MenuItem title={item.title} subtitle={item.subtitle} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}