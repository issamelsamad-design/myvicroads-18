import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Mail, MapPin, Lock, Key, Fingerprint, HelpCircle, MessageSquare } from 'lucide-react';
import MenuItem from '@/components/MenuItem';

const AccordionSection = ({ title, icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-b-0">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="text-muted-foreground">{icon}</div>
          <p className="text-[15px] font-medium text-foreground">{title}</p>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}><ChevronDown className="w-5 h-5 text-muted-foreground" /></motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden bg-muted/20">
            <div className="pl-14 pr-5 py-2 border-l-2 border-primary/20 ml-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Profile() {
  const navigate = useNavigate();
  return (
    <div className="bg-background min-h-screen pb-24">
      <div className="bg-card px-5 py-6 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account settings</p>
      </div>
      <div className="bg-card mt-6">
        <AccordionSection title="Personal information" icon={<Mail className="w-5 h-5" />}>
          <MenuItem title="Email" subtitle="Update your email address" onClick={() => navigate('/profile/email')} showChevron />
          <MenuItem title="Mobile number" subtitle="Update your phone number" onClick={() => navigate('/profile/mobile')} showChevron />
        </AccordionSection>
        <AccordionSection title="Addresses" icon={<MapPin className="w-5 h-5" />}>
          <MenuItem title="Home address" subtitle="Update your residential address" onClick={() => navigate('/profile/address')} showChevron />
        </AccordionSection>
        <AccordionSection title="Security settings" icon={<Lock className="w-5 h-5" />}>
          <MenuItem title="Password" subtitle="Change your account password" onClick={() => navigate('/profile/security')} showChevron />
          <MenuItem title="Two-step verification" subtitle="Add extra security to your account" onClick={() => navigate('/profile/security?tab=2fa')} showChevron />
        </AccordionSection>
        <AccordionSection title="Passkey settings" icon={<Key className="w-5 h-5" />}>
          <MenuItem title="Manage passkeys" subtitle="Add or remove passkeys for passwordless login" onClick={() => navigate('/profile/passkeys')} showChevron />
        </AccordionSection>
      </div>
      <div className="bg-card mt-6">
        <div className="px-5 py-3"><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">App controls</p></div>
        <MenuItem title="Biometrics" subtitle="Use fingerprint or face ID to log in" rightIcon={<Fingerprint className="w-5 h-5 text-muted-foreground" />} onClick={() => navigate('/profile/biometrics')} showChevron />
        <MenuItem title="Help and info" subtitle="Get support and learn more" rightIcon={<HelpCircle className="w-5 h-5 text-muted-foreground" />} onClick={() => navigate('/profile/help')} showChevron />
        <MenuItem title="Feedback" subtitle="Send us your thoughts" rightIcon={<MessageSquare className="w-5 h-5 text-muted-foreground" />} onClick={() => navigate('/profile/feedback')} showChevron />
      </div>
    </div>
  );
}
