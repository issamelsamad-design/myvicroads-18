import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PinEntry() {
  const navigate = useNavigate();
  const [pin, setPin] = useState('');

  const handleKey = (val) => {
    if (pin.length < 6) {
      const next = pin + val;
      setPin(next);
      if (next.length === 6) {
        setTimeout(() => navigate('/home'), 300);
      }
    }
  };

  const handleDelete = () => {
    setPin(p => p.slice(0, -1));
  };

  return (
    <>
      <style>{`body { background-color: #ffffff !important; }`}</style>
      <div className="fixed inset-0 z-0" style={{ backgroundColor: '#ffffff' }} />
      <div className="relative z-10 min-h-screen bg-white flex flex-col items-center justify-between px-6 pt-20 pb-10 max-w-lg mx-auto">
        {/* Top section */}
        <div className="flex flex-col items-center gap-6 w-full">
          {/* Lock icon */}
          <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="38" width="70" height="48" rx="8" fill="#43a047"/>
            <path d="M28 38V28C28 17.5 62 17.5 62 28V38" stroke="#4caf50" strokeWidth="9" strokeLinecap="round" fill="none"/>
            <rect x="10" y="38" width="70" height="48" rx="8" fill="#43a047"/>
            <circle cx="45" cy="58" r="7" fill="#1a2a1a"/>
            <rect x="42" y="60" width="6" height="10" rx="3" fill="#1a2a1a"/>
          </svg>

          {/* Title */}
          <p className="text-[22px] font-bold text-gray-900 text-center">
            Please enter your existing PIN code
          </p>

          {/* PIN dots */}
          <div className="flex gap-8 mt-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{ borderWidth: '1.5px' }}
                className={`w-7 h-7 rounded-full transition-all ${
                  i < pin.length
                    ? 'bg-gray-900 border-gray-900'
                    : 'bg-white border-black'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Keypad */}
        <div className="w-full mt-10">
          {[['1','2','3'],['4','5','6'],['7','8','9']].map((row) => (
            <div key={row.join('')} className="flex justify-between mb-2">
              {row.map((num) => (
                <button
                  key={num}
                  onClick={() => handleKey(num)}
                  className="flex-1 py-5 text-[28px] font-medium text-gray-900 active:bg-gray-100 rounded-xl transition-colors"
                >
                  {num}
                </button>
              ))}
            </div>
          ))}

          {/* Bottom row */}
          <div className="flex justify-between">
            <button
              onClick={() => {}}
              className="flex-1 py-5 text-[16px] font-medium text-gray-500 active:bg-gray-100 rounded-xl transition-colors"
            >
              Forgot?
            </button>
            <button
              onClick={() => handleKey('0')}
              className="flex-1 py-5 text-[28px] font-medium text-gray-900 active:bg-gray-100 rounded-xl transition-colors"
            >
              0
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 py-5 flex items-center justify-center active:bg-gray-100 rounded-xl transition-colors"
            >
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/>
                <line x1="18" y1="9" x2="12" y2="15"/>
                <line x1="12" y1="9" x2="18" y2="15"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}