import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Toggle = ({ label, checked, onChange, danger = false }) => (
  <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-b-0">
    <span className="text-[15px] font-medium text-slate-900">{label}</span>
    <button
      onClick={onChange}
      className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
        checked ? (danger ? 'bg-red-500' : 'bg-[#5aab2a]') : 'bg-slate-200'
      }`}
    >
      <div
        className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

export default function BiometricsSettings() {
  const navigate = useNavigate();
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [cardsDeactivated, setCardsDeactivated] = useState(false);
  const [accountDeactivated, setAccountDeactivated] = useState(false);

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-slate-50 px-5 py-4 flex items-center gap-3 border-b border-slate-200">
        <button onClick={() => navigate(-1)} className="p-1 hover:bg-slate-200 rounded-full">
          <ArrowLeft className="w-6 h-6 text-slate-700" />
        </button>
        <h1 className="text-xl font-semibold text-slate-900">Biometrics and settings</h1>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <Toggle
            label="Enable biometrics"
            checked={biometricsEnabled}
            onChange={() => setBiometricsEnabled(!biometricsEnabled)}
          />
          <Toggle
            label="Deactivate cards"
            checked={cardsDeactivated}
            onChange={() => setCardsDeactivated(!cardsDeactivated)}
          />
          <Toggle
            label="Deactivate myVicRoads account"
            checked={accountDeactivated}
            onChange={() => setAccountDeactivated(!accountDeactivated)}
            danger={true}
          />
        </div>
      </div>
    </div>
  );
}
