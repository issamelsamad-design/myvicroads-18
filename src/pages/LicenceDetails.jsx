import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useLicenceData } from '../lib/licenceData';
import { QRCodeSVG } from 'qrcode.react';




// --- Barcode ---
function Barcode({ value }) {
  const CODE39 = {
    '0':'nnnwwnwnn','1':'wnnwnnnnw','2':'nnwwnnnnw','3':'wnwwnnnnn',
    '4':'nnnwwnnnw','5':'wnnwwnnnn','6':'nnwwwnnnn','7':'nnnwnnwnw',
    '8':'wnnwnnwnn','9':'nnwwnnwnn','A':'wnnnnwnnw','B':'nnwnnwnnw',
    'C':'wnwnnwnnn','D':'nnnnwwnnw','E':'wnnnwwnnn','F':'nnwnwwnnn',
    '-':'nnnnnwwnw','*':'nwnwnnwnw'
  };
  const QUIET = 10, NARROW = 2, WIDE = 5, HEIGHT = 60;
  const str = '*' + value.toUpperCase() + '*';
  const rects = [];
  let x = QUIET;
  for (let ci = 0; ci < str.length; ci++) {
    const pattern = CODE39[str[ci]] || CODE39['0'];
    for (let bi = 0; bi < 9; bi++) {
      const w = pattern[bi] === 'w' ? WIDE : NARROW;
      if (bi % 2 === 0) rects.push({ x, w });
      x += w;
    }
    x += NARROW;
  }
  const totalW = x + QUIET;
  return (
    <svg viewBox={`0 0 ${totalW} ${HEIGHT}`} className="w-full h-14">
      {rects.map((r, i) => <rect key={i} x={r.x} y={0} width={r.w} height={HEIGHT} fill="black" />)}
    </svg>
  );
}

// --- VicRoads logo text ---
function VicRoadsLogo() {
  return (
    <div className="flex items-center gap-1.5">
      <img
        src="https://media.base44.com/images/public/69ff2070757a0b2ea8afc443/a32ef7b3f_IMG_0598.jpeg"
        alt="VicRoads"
        style={{ width: 28, height: 28, objectFit: 'contain' }}
      />
      <span className="text-white font-bold text-[15px] tracking-tight">vicroads</span>
    </div>
  );
}

const now = new Date();
const REFRESHED = now.toLocaleDateString('en-AU', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }) +
  ' ' + now.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();

export default function LicenceDetails() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('licence');
  const [showQR, setShowQR] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrTimer, setQrTimer] = useState(120);
  const [pageLoading, setPageLoading] = useState(true);
  const { data } = useLicenceData();

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const pPlateColor = data.pPlateColor || 'green';
  const headerBg = pPlateColor === 'red' ? '#d93025' : '#d93025'; // match image red
  const photoBg = pPlateColor === 'red' ? '#a5d6a7' : '#a5d6a7'; // always light green from screenshot

  const formatAddress = (addr) => {
    if (!addr || !addr.trim()) return { line1: '—', line2: '' };
    if (addr.includes('\n')) {
      const parts = addr.split('\n').filter(Boolean);
      return { line1: parts[0].trim().toUpperCase(), line2: parts.slice(1).join(' ').trim().toUpperCase() };
    }
    const parts = addr.split(',');
    if (parts.length >= 2) {
      return { line1: parts[0].trim().toUpperCase(), line2: parts.slice(1).join(',').trim().toUpperCase() };
    }
    return { line1: addr.toUpperCase(), line2: '' };
  };
  const formattedAddr = formatAddress(data.address);

  useEffect(() => {
    if (!showQR) { setQrTimer(120); return; }
    const interval = setInterval(() => {
      setQrTimer(t => t <= 1 ? 120 : t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [showQR]);

  const formatTimer = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  const licenceNumber = data.licenceNumber || data.permitNumber || '082643104';
  const expiry = data.expiryDate || data.p1EndDate || '28 Feb 2030';
  const dob = data.dob || '18 Feb 2008';
  const fullName = data.fullName ? data.fullName.toUpperCase() : '—';

  const qrValue = (() => {
    try {
      const payload = {
        name: fullName || '',
        dob: dob || '',
        licenceNumber: licenceNumber || '',
        expiry: expiry || '',
        status: 'Current',
        state: 'Victoria',
        issuer: 'VicRoads',
      };
      const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
      return `${window.location.origin}/verify-licence?d=${encoded}`;
    } catch {
      return window.location.origin;
    }
  })();

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-white max-w-lg mx-auto flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white max-w-lg mx-auto">
      {/* Header */}
      <div className="px-4 pt-8 pb-3 bg-white">
        <div className="flex items-center justify-center relative">
          <button onClick={() => navigate(-1)} className="absolute left-0 p-1">
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <h1 className="text-[18px] font-semibold text-gray-900">View details</h1>
        </div>
        <p className="text-center text-[13px] text-gray-500 mt-2">
          Last refreshed: <span className="font-medium">{REFRESHED}</span>
        </p>
      </div>

      {/* Red licence header bar */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: '#d93025' }}>
        <div>
          <p className="text-white font-bold text-[13px] tracking-wide uppercase">
            Probationary Driver Licence
          </p>
          <p className="text-white/80 text-[12px]">Victoria Australia</p>
        </div>
        <VicRoadsLogo />
      </div>

      {/* Photo + QR section */}
      <div className="flex relative overflow-hidden" style={{ backgroundColor: '#b8d9b0', height: 260 }}>
        {/* Diagonal crosshatch watermark like real licence */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="diag" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="10" stroke="rgba(255,255,255,0.5)" strokeWidth="3"/>
            </pattern>
            <pattern id="diagrev" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
              <line x1="0" y1="0" x2="0" y2="10" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diag)"/>
          <rect width="100%" height="100%" fill="url(#diagrev)"/>
        </svg>
        {/* Coat of arms watermarks like real licence */}
        <img src="/coat-of-arms-white.png" alt="" aria-hidden="true" style={{
          position: 'absolute', left: '10px', top: '10px',
          width: 140, height: 140, opacity: 0.18, pointerEvents: 'none'
        }} />
        <img src="/coat-of-arms-white.png" alt="" aria-hidden="true" style={{
          position: 'absolute', right: '10px', bottom: '10px',
          width: 140, height: 140, opacity: 0.18, pointerEvents: 'none'
        }} />
        <img src="/coat-of-arms-white.png" alt="" aria-hidden="true" style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 120, height: 120, opacity: 0.12, pointerEvents: 'none'
        }} />

        {/* Photo */}
        <div className="w-[55%] relative h-full flex items-center justify-center p-4">
          {data.photo ? (
            <img src={data.photo} alt="profile" className="object-cover rounded-xl" style={{ width: 175, height: 235 }} />
          ) : (
            <div className="rounded-xl bg-white/20 flex items-center justify-center" style={{ width: 175, height: 235 }}>
              <p className="text-white/60 text-sm">No photo</p>
            </div>
          )}
        </div>

        {/* QR consent card */}
        <div className="w-[45%] flex items-center justify-center relative z-10">
          <div className="bg-white rounded-2xl p-3 text-center shadow-sm flex flex-col justify-center gap-2" style={{ width: 175, height: 235 }}>
            <p className="text-[10px] text-gray-500 leading-snug">
              Presenting a QR code allows your driver licence information to be scanned and shared.
            </p>
            <p className="text-[11px] font-bold text-gray-900 leading-snug">
              Do you consent to share your information?
            </p>
            <button
              onClick={() => { setQrLoading(true); setShowQR(true); setTimeout(() => setQrLoading(false), 1200); }}
              className="bg-gray-900 text-white text-[11px] font-semibold px-2 py-2 rounded-full w-full"
            >
              Reveal QR code
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-5 pb-4 bg-white">
        <div className="flex border border-gray-300 rounded-full p-0.5">
          {['licence', 'identity', 'age'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-full text-[15px] font-medium capitalize transition-all ${
                activeTab === tab
                  ? 'bg-gray-900 text-white'
                  : 'bg-transparent text-gray-500'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* LICENCE TAB */}
      {activeTab === 'licence' && (
        <div className="pb-24 bg-white">
          {/* Name header */}
          <div className="px-4 pt-5 pb-4 bg-white">
            <h2 className="text-[20px] font-black text-[#000000]">{fullName}</h2>
          </div>

          {/* Licence number + Expiry */}
          <div className="px-4 bg-white grid grid-cols-2 gap-4 pb-5 border-t border-[#e5e5ea]">
            <div className="pt-4">
              <p className="text-[14px] text-[#8e8e93] font-normal mb-1">Licence number</p>
              <p className="text-[17px] font-bold text-[#000000]">{licenceNumber}</p>
            </div>
            <div className="pt-4">
              <p className="text-[14px] text-[#8e8e93] font-normal mb-1">Expiry</p>
              <p className="text-[17px] font-bold text-[#000000]">{expiry}</p>
            </div>
          </div>

          {/* Licence type + DOB */}
          <div className="px-4 bg-white grid grid-cols-2 gap-4 py-5 border-t border-[#e5e5ea]">
            <div>
              <p className="text-[14px] text-[#8e8e93] font-normal mb-1">Licence type</p>
              <div className="flex items-center gap-2">
                <p className="text-[17px] font-bold text-[#000000]">Car</p>
                <span className="w-6 h-6 rounded flex items-center justify-center text-white text-[11px] font-bold" style={{ backgroundColor: '#c62828' }}>P</span>
              </div>
            </div>
            <div>
              <p className="text-[14px] text-[#8e8e93] font-normal mb-1">Date of birth</p>
              <p className="text-[17px] font-bold text-[#000000]">{dob}</p>
            </div>
          </div>

          {/* Address */}
          <div className="px-4 bg-white py-5 border-t border-[#e5e5ea]">
            <p className="text-[14px] text-[#8e8e93] font-normal mb-1">Address</p>
            <p className="text-[17px] font-bold text-[#000000]">{formattedAddr.line1}</p>
            {formattedAddr.line2 && <p className="text-[17px] font-bold text-[#000000]">{formattedAddr.line2}</p>}
          </div>

          {/* Signature */}
          <div className="px-4 bg-white py-5 border-t border-[#e5e5ea]">
            <p className="text-[14px] text-[#8e8e93] font-normal mb-1">Signature</p>
            {data.signature ? (
              <img src={data.signature} alt="signature" className="h-16 object-contain" />
            ) : (
              <p className="text-[14px] text-gray-400 italic">No signature on file</p>
            )}
          </div>

          {/* Car licence details section header */}
          <div className="px-4 py-3 mt-2 bg-[#f2f2f7]">
            <p className="text-[15px] font-semibold text-[#000000]">Car licence details</p>
          </div>

          {/* Licence status */}
          <div className="px-4 bg-white py-4 border-b border-[#e5e5ea]">
            <p className="text-[14px] text-[#8e8e93] font-normal mb-1.5">Licence status</p>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 12 12" width="10" height="10" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-[17px] font-bold text-[#000000]">Current</p>
            </div>
          </div>

          {/* Proficiency */}
          <div className="px-4 bg-white py-4 border-b border-[#e5e5ea]">
            <p className="text-[14px] text-[#8e8e93] font-normal mb-1.5">Proficiency</p>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0" style={{ backgroundColor: '#c62828' }}>P</span>
              <p className="text-[17px] font-bold text-[#000000]">P1</p>
            </div>
          </div>

          {/* Issue date */}
          <div className="px-4 bg-white py-4 border-b border-[#e5e5ea]">
            <p className="text-[14px] text-[#8e8e93] font-normal mb-1">Issue date</p>
            <p className="text-[17px] font-bold text-[#000000]">{data.issueDate || '28 Feb 2026'}</p>
          </div>

          {/* P1 end date */}
          <div className="px-4 bg-white py-4 border-b border-[#e5e5ea]">
            <p className="text-[14px] text-[#8e8e93] font-normal mb-1">P1 end date</p>
            <p className="text-[17px] font-bold text-[#000000]">{data.p1EndDate || '28 Feb 2027'}</p>
          </div>

          {/* Expiry */}
          <div className="px-4 bg-white py-4">
            <p className="text-[14px] text-[#8e8e93] font-normal mb-1">Expiry</p>
            <p className="text-[17px] font-bold text-[#000000]">{expiry}</p>
          </div>

          {/* Other details section header */}
          <div className="px-4 py-3 mt-2 bg-[#f2f2f7]">
            <p className="text-[15px] font-semibold text-[#000000]">Other details</p>
          </div>

          {/* Conditions */}
          <div className="px-4 bg-white py-4 border-b border-[#e5e5ea]">
            <p className="text-[14px] text-[#8e8e93] font-normal mb-1">Conditions</p>
            <p className="text-[17px] font-bold text-[#000000]">A&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Automatic transmission - (car)</p>
          </div>

          {/* Card number */}
          <div className="px-4 bg-white py-4 border-b border-[#e5e5ea]">
            <p className="text-[14px] text-[#8e8e93] font-normal mb-1">Card number</p>
            <div className="flex items-center justify-between">
              <p className="text-[17px] font-bold text-[#000000]">
                {showCardNumber ? (data.cardNumber || '••••••••') : '••••••••'}
              </p>
              <button onClick={() => setShowCardNumber(v => !v)}>
                {showCardNumber ? (
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Barcode */}
          <div className="px-4 bg-white py-4">
            <p className="text-[14px] text-[#8e8e93] font-normal mb-1">Victoria Police barcode</p>
            <Barcode value={licenceNumber} />
          </div>
        </div>
      )}

      {/* IDENTITY TAB */}
      {activeTab === 'identity' && (
        <div className="px-4 pt-5 pb-24 bg-white">
          <h2 className="text-[20px] font-black text-[#000000] mb-5">{fullName}</h2>

          {/* Address */}
          <div className="pb-5 border-b border-[#e5e5ea]">
            <p className="text-[14px] text-[#8e8e93] font-normal mb-1">Address</p>
            <p className="text-[17px] font-bold text-[#000000]">{formattedAddr.line1}</p>
            {formattedAddr.line2 && <p className="text-[17px] font-bold text-[#000000]">{formattedAddr.line2}</p>}
          </div>

          {/* Signature */}
          <div className="pt-5">
            <p className="text-[14px] text-[#8e8e93] font-normal mb-1">Signature</p>
            {data.signature ? (
              <img src={data.signature} alt="signature" className="h-14 object-contain" />
            ) : (
              <p className="text-[14px] text-gray-400 italic">No signature on file</p>
            )}
          </div>
        </div>
      )}

      {/* AGE TAB */}
      {activeTab === 'age' && (
        <div className="px-4 pt-5 pb-24 bg-white">
          <h2 className="text-[20px] font-black text-[#000000] mb-5">{fullName}</h2>

          <div>
            <p className="text-[14px] text-[#8e8e93] font-normal mb-1">Age status</p>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 12 12" width="10" height="10" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-[17px] font-bold text-[#000000]">Over 18</p>
            </div>
          </div>
        </div>
      )}

      {/* QR Modal */}
      
        {showQR && (
          <div
            className="fixed inset-0 bg-white z-50 overflow-y-auto max-w-lg mx-auto"
          >
            <div className="px-6 pt-8 pb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[20px] font-bold text-gray-900">Verify Licence</h2>
                <button onClick={() => setShowQR(false)} className="text-[17px] font-semibold text-gray-900">
                  Close
                </button>
              </div>
              <div className="mb-6 relative flex items-center justify-center">
                <div style={{ filter: qrLoading ? 'blur(4px)' : 'none', transition: 'filter 0.3s', boxShadow: 'none' }}>
                  <QRCodeSVG
                    value={qrValue}
                    size={120 * 4}
                    level="H"
                    bgColor="transparent"
                    style={{ width: '100%', height: 'auto', display: 'block', boxShadow: 'none', filter: 'none' }}
                  />
                </div>
                {qrLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-4 border-green-200 border-t-green-600 animate-spin" />
                  </div>
                )}

              </div>
              <p className="text-center text-[14px] text-gray-600 mb-6">
                QR expires <span className="font-bold">{formatTimer(qrTimer)}</span>
              </p>
              <p className="text-[13px] text-gray-600 leading-relaxed mb-6">
                By presenting this QR code you <strong>consent</strong> to share some or all of your driver licence information, including with scanners, venues and law enforcement agencies. They may retain your information in accordance with their business practices and legal requirements.
              </p>
              <div>
                <p className="text-[14px] font-semibold text-gray-900 mb-3">You're sharing:</p>
                <ul className="space-y-2">
                  {['Victorian driver licence photo','Full name, birth date and address','Licence number, type and expiry date','Licence status','Proficiency'].map((item) => (
                    <li key={item} className="text-[14px] text-gray-700 flex gap-2"><span>•</span>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      
    </div>
  );
}