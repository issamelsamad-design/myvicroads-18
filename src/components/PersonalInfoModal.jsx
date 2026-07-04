import { useState } from 'react';
import { User, Mail, Phone, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AccordionItem = ({ icon: Icon, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center justify-between px-6 py-6 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <Icon className="w-8 h-8 text-[#5aab2a]" />
          <span className="text-[22px] font-medium text-gray-800">{title}</span>
        </div>
        <ChevronDown className={`w-6 h-6 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-gray-50"
          >
            <div className="px-6 py-4">
              <p className="text-gray-600 text-sm">Details for {title} will appear here.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function PersonalInfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-white flex flex-col"
    >
      <div className="flex justify-end p-4 pt-6">
        <button 
          onClick={onClose} 
          className="text-lg font-medium text-gray-800 hover:text-gray-600"
        >
          Close
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto mt-2">
        <AccordionItem icon={User} title="Profile" />
        <AccordionItem icon={Mail} title="Email address" />
        <AccordionItem icon={Phone} title="Mobile number" />
      </div>
    </motion.div>
  );
}
