import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, Apple, Key } from 'lucide-react';

const PasskeyItem = ({ provider, title, subtitle, synced, hybrid, created }) => (
  <div className="bg-white rounded-xl border border-slate-300 p-4 relative">
    <button className="absolute top-3 right-3 text-slate-400 hover:text-slate-600">
      <X className="w-5 h-5" />
    </button>
    <div className="flex items-center gap-3 mb-3">
      {provider === 'apple' ? (
        <Apple className="w-6 h-6 text-slate-900" />
      ) : (
        <Key className="w-6 h-6 text-blue-500" />
      )}
      <span className="text-lg font-semibold text-slate-900">{title}</span>
    </div>
    <div className="flex gap-2 mb-2">
      <span className="px-3 py-1 bg-[#d4edda] text-[#155724] text-xs font-medium rounded-full">
        {synced}
      </span>
      <span className="px-3 py-1 bg-[#d4edda] text-[#155724] text-xs font-medium rounded-full">
        {hybrid}
      </span>
    </div>
    <p className="text-sm text-slate-600">{created}</p>
  </div>
);

export default function PasskeySettings() {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-slate-50 px-5 py-4 flex items-center gap-3 border-b border-slate-200">
        <button onClick={() => navigate(-1)} className="p-1 hover:bg-slate-200 rounded-full">
          <ArrowLeft className="w-6 h-6 text-slate-700" />
        </button>
        <h1 className="text-xl font-semibold text-slate-900">Passkey settings</h1>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-4">
          <p className="text-slate-900 mb-4 leading-relaxed">
            Log in without a password using Face ID, Fingerprint, PIN or pattern across different browsers or devices.
          </p>
          <a href="#" className="text-[#5aab2a] underline text-sm hover:text-[#3a7d2c]">
            Learn more about passkeys
          </a>
        </div>

        <button className="w-full bg-[#2c3e50] text-white py-3.5 rounded-full font-medium text-lg mb-4 hover:bg-[#1a252f] transition-colors">
          Add a passkey
        </button>

        <div className="space-y-3">
          <PasskeyItem
            provider="apple"
            title="iCloud Keychain"
            synced="Synced"
            hybrid="Hybrid"
            created="Created: 2025-10-23 19:17:23 with Safari on iOS"
          />
          <PasskeyItem
            provider="google"
            title="Google Password Manager"
            synced="Synced"
            hybrid="Hybrid"
            created="Created: 2025-06-02 13:03:13 with Chrome on Windows"
          />
        </div>
      </div>
    </div>
  );
}
