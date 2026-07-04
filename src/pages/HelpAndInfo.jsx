import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';

const MenuItem = ({ title, onClick, showChevron = true }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
  >
    <span className="text-[15px] font-medium text-slate-900">{title}</span>
    {showChevron && <ChevronRight className="w-5 h-5 text-slate-400" />}
  </button>
);

export default function HelpAndInfo() {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-slate-50 px-5 py-4 flex items-center gap-3 border-b border-slate-200">
        <button onClick={() => navigate(-1)} className="p-1 hover:bg-slate-200 rounded-full">
          <ArrowLeft className="w-6 h-6 text-slate-700" />
        </button>
        <h1 className="text-xl font-semibold text-slate-900">Help and info</h1>
      </div>

      <div className="p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
          <MenuItem 
            title="Product tour" 
            onClick={() => alert('Product tour will start here')}
          />
          <MenuItem 
            title="How to use the app" 
            onClick={() => alert('Help documentation will open here')}
          />
          <MenuItem 
            title="Privacy Policy and Terms & Conditions" 
            onClick={() => alert('Privacy Policy and Terms will open here')}
            showChevron={false}
          />
        </div>
      </div>
    </div>
  );
}
