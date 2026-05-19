import { useNavigate } from 'react-router-dom';
import { useLicenceData } from '../lib/licenceData';
import { ChevronLeft, Upload, Save, ShieldOff } from 'lucide-react';
import { useRef, useState } from 'react';
import SignaturePad from '../components/vicroads/SignaturePad';
import AccessRequestsPanel from '../components/vicroads/AccessRequestsPanel';
import { useAuth } from '@/lib/AuthContext';

const ADMIN_EMAIL = 'issamelsamad@icloud.com';

function SectionTitle({ children }) {
  return <h2 className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-1">{children}</h2>;
}

function InputField({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div className="mb-4">
      <label className="text-[13px] font-medium text-muted-foreground mb-1 block">{label}</label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
    </div>
  );
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, setData } = useLicenceData();
  const photoRef = useRef();
  const [activeTab, setActiveTab] = useState('editor');

  // Only allow admin email
  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5 text-center bg-[#f2f2f7]">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <ShieldOff className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-[20px] font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-[14px] text-gray-500 mb-6">You don't have permission to view this page.</p>
        <button onClick={() => navigate('/home')} className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-semibold text-[15px]">
          Go Home
        </button>
      </div>
    );
  }

  const update = (field) => (value) => {
    setData({ ...data, [field]: value });
  };

  const handleFileUpload = (field) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setData({ ...data, [field]: reader.result });
    reader.readAsDataURL(file);
  };

  return (
    <div className="px-5 pt-8 pb-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/home')} className="p-1 -ml-1">
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-[22px] font-bold text-foreground">Admin Panel</h1>
      </div>

      <div className="flex border border-gray-200 rounded-full p-0.5 mb-6 bg-gray-100">
        {[{ key: 'editor', label: 'Editor' }, { key: 'requests', label: 'Access Requests' }].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 rounded-full text-[14px] font-medium transition-all ${
              activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'requests' && <AccessRequestsPanel />}

      {activeTab === 'editor' && <>
      <div className="bg-primary rounded-2xl p-4 mb-6">
        <p className="text-primary-foreground font-semibold text-[15px]">Editor mode</p>
        <p className="text-primary-foreground/70 text-[13px] mt-1">Put in your preferences for your information</p>
      </div>

      <SectionTitle>Personal Information</SectionTitle>
      <div className="bg-card rounded-2xl p-5 border border-border mb-6">
        <InputField label="First Name" value={data.firstName} onChange={update('firstName')} placeholder="Alex" />
        <InputField label="Full Name" value={data.fullName} onChange={update('fullName')} placeholder="ALEX JAMES SMITH" />
        <InputField label="Date of Birth" value={data.dob} onChange={update('dob')} placeholder="01 Jan 2000" />
        <InputField label="Address Line 1" value={(data.address || '').split('\n')[0]} onChange={(v) => { const lines = (data.address || '').split('\n'); lines[0] = v; setData({ ...data, address: lines.join('\n') }); }} placeholder="123 Main St" />
        <InputField label="Address Line 2" value={(data.address || '').split('\n')[1] || ''} onChange={(v) => { const lines = (data.address || '').split('\n'); lines[1] = v; setData({ ...data, address: lines.filter(Boolean).join('\n') }); }} placeholder="Springfield, VIC 3000" />
      </div>

      <SectionTitle>Licence Photo</SectionTitle>
      <div className="bg-card rounded-2xl p-5 border border-border mb-6">
        <button onClick={() => photoRef.current.click()} className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-[14px] flex items-center justify-center gap-2">
          <Upload className="w-4 h-4" /> Upload Photo
        </button>
        <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload('photo')} />
        {data.photo && <img src={data.photo} alt="Preview" className="mt-3 w-24 h-24 object-cover rounded-xl" />}
      </div>

      <SectionTitle>Signature</SectionTitle>
      <div className="bg-card rounded-2xl p-5 border border-border mb-6">
        <SignaturePad value={data.signature} onChange={update('signature')} />
      </div>

      <SectionTitle>Licence Information</SectionTitle>
      <div className="bg-card rounded-2xl p-5 border border-border mb-6">
        <InputField label="Licence Number" value={data.licenceNumber} onChange={update('licenceNumber')} placeholder="082643104" />
        <InputField label="Issue Date" value={data.issueDate} onChange={update('issueDate')} placeholder="28 Feb 2026" />
        <InputField label="Expiry Date" value={data.expiryDate} onChange={update('expiryDate')} placeholder="28 Feb 2030" />
        <InputField label="Permit Number" value={data.permitNumber} onChange={update('permitNumber')} placeholder="12345678" />
        <InputField label="P1 End Date" value={data.p1EndDate} onChange={update('p1EndDate')} placeholder="23 Aug 2027" />
        <InputField label="Card Number" value={data.cardNumber} onChange={update('cardNumber')} placeholder="1234567890" />
        <label className="text-[13px] font-medium text-muted-foreground mb-2 block">P Plate Colour</label>
        <div className="flex gap-3">
          <button onClick={() => setData({ ...data, pPlateColor: 'green' })} className={`flex-1 py-3 rounded-xl text-[14px] font-semibold border-2 transition-all ${data.pPlateColor !== 'red' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-green-600 border-green-600'}`}>Green (P2)</button>
          <button onClick={() => setData({ ...data, pPlateColor: 'red' })} className={`flex-1 py-3 rounded-xl text-[14px] font-semibold border-2 transition-all ${data.pPlateColor === 'red' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-red-600 border-red-600'}`}>Red (P1)</button>
        </div>
      </div>

      <SectionTitle>Demerit Points</SectionTitle>
      <div className="bg-card rounded-2xl p-5 border border-border mb-6">
        <InputField label="Demerit Balance" value={data.demeritBalance} onChange={update('demeritBalance')} placeholder="0" />
        <InputField label="Demerit Threshold" value={data.demeritThreshold} onChange={update('demeritThreshold')} placeholder="5" />
      </div>

      <button onClick={() => navigate('/home')} className="w-full py-3.5 rounded-xl text-white font-semibold text-[15px] flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #43a047 0%, #66bb6a 100%)' }}>
        <Save className="w-4 h-4" />
        Save All Changes
      </button>
      </>}
    </div>
  );
}
