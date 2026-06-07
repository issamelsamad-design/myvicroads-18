import { useState, useEffect, useRef } from 'react';

function useHoloTilt() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const enabled = localStorage.getItem('holo_enabled') === 'true';

  useEffect(() => {
    if (!enabled) return;
    const handleMotion = (e) => {
      const x = Math.max(-30, Math.min(30, e.gamma || 0));
      const y = Math.max(-30, Math.min(30, (e.beta || 0) - 45));
      setTilt({ x, y });
    };
    window.addEventListener('deviceorientation', handleMotion);
    return () => window.removeEventListener('deviceorientation', handleMotion);
  }, [enabled]);

  // shimmer = 0 (dark/grey) to 1 (bright white) based on tilt angle
  const shimmer = enabled ? Math.abs(tilt.x) / 30 : 0;
  return { shimmer, enabled };
}

function HolographicOverlay() {
  const { shimmer, enabled } = useHoloTilt();
  if (!enabled) return null;
  return (
    <div aria-hidden="true" style={{
      position: 'absolute', inset: 0,
      pointerEvents: 'none', zIndex: 5,
      background: `linear-gradient(${120 + shimmer * 60}deg, transparent 20%, rgba(255,255,255,${shimmer * 0.5}) 50%, transparent 80%)`,
      mixBlendMode: 'screen',
      transition: 'background 0.1s ease',
    }} />
  );
}

function CoatOfArms({ style }) {
  const { shimmer, enabled } = useHoloTilt();
  const opacity = enabled ? 0.4 + shimmer * 0.2 : 0.4;
  return (
    <img
      src="/coat-of-arms-white.png"
      alt=""
      aria-hidden="true"
      style={{
        ...style,
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
}


import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useLicenceData } from '../lib/licenceData';
import { useAuth } from '../lib/AuthContext';
import { storage } from '../lib/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
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
  const { data, setData } = useLicenceData();

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
    if (!showQR || qrLoading) { if (!showQR) setQrTimer(120); return; }
    const interval = setInterval(() => {
      setQrTimer(t => {
        if (t <= 1) { setShowQR(false); return 120; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showQR, qrLoading]);

  const formatTimer = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  const licenceNumber = data.licenceNumber || data.permitNumber || '082643104';
  const expiry = data.expiryDate || data.p1EndDate || '28 Feb 2030';
  const dob = data.dob || '18 Feb 2008';
  const fullName = data.fullName ? data.fullName.toUpperCase() : '—';

  const qrValue = (() => {
    try {
      // Only include URL-based photos (Firebase URLs), not base64 blobs which break btoa
      const photoUrl = (data.photo && data.photo.startsWith('http')) ? data.photo : '';
      const sigUrl = (data.signature && data.signature.startsWith('http')) ? data.signature : '';
      const payload = {
        name: fullName || '',
        dob: dob || '',
        licenceNumber: licenceNumber || '',
        expiry: expiry || '',
        address: data.address || '',
        photo: photoUrl,
        signature: sigUrl,
        pPlateColor: data.pPlateColor || 'green',
        conditions: data.conditions || '',
        p1EndDate: data.p1EndDate || '',
        issueDate: data.issueDate || '',
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
      <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'conic-gradient(from 0deg, rgba(67,160,71,0) 0%, #43a047 100%)', WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 5px))', mask: 'radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 5px))', animation: 'spin 0.8s linear infinite' }} />
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
          <h1 className="text-[17px] font-medium text-[#3a3a3c]">View details</h1>
        </div>
        <p className="text-center text-[13px] text-gray-400 mt-1">
          Last refreshed: <span className="font-normal">{REFRESHED}</span>
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
      <div className="flex relative overflow-hidden" style={{ backgroundColor: '#cfe4ad', height: 280, boxShadow: '0 6px 20px rgba(0,0,0,0.18)' }}>

        {/* Diagonal lines */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="diaglines" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(255,255,255,0.22)" strokeWidth="0.6"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diaglines)"/>
        </svg>

        {/* Middle watermark — sits at photo/QR boundary, behind QR card */}
        <div aria-hidden="true" style={{
          position: 'absolute', left: '46%', top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 124, height: 194, opacity: 0.46, pointerEvents: 'none', zIndex: 1,
          backgroundColor: '#c4966e',
          WebkitMaskImage: 'url(/coat-of-arms-white.png)', maskImage: 'url(/coat-of-arms-white.png)',
          WebkitMaskSize: 'contain', maskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center', maskPosition: 'center',
        }} />

        {/* Right edge watermark — behind QR card, peeks from right edge */}
        <div aria-hidden="true" style={{
          position: 'absolute', right: '-18px', top: '50%',
          transform: 'translateY(-50%)',
          width: 90, height: 141, opacity: 0.42, pointerEvents: 'none', zIndex: 1,
          backgroundColor: '#b6d09e',
          WebkitMaskImage: 'url(/coat-of-arms-white.png)', maskImage: 'url(/coat-of-arms-white.png)',
          WebkitMaskSize: 'contain', maskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center', maskPosition: 'center',
        }} />

        {/* Photo column — flush left, small padding */}
        <div className="w-[50%] relative h-full flex items-center justify-center" style={{ zIndex: 2, padding: '14px 6px 14px 10px' }}>
          <div className="relative rounded-2xl overflow-hidden w-full h-full" style={{ zIndex: 2 }}>
            {data.photo ? (
              <img src={data.photo} alt="profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-white/20 flex items-center justify-center">
                <p className="text-white/60 text-sm">No photo</p>
              </div>
            )}
            {/* 3 watermarks on photo */}
            <CoatOfArms style={{ position: 'absolute', top: 6, left: 6, width: 72, height: 'auto', zIndex: 5 }} />
            <CoatOfArms style={{ position: 'absolute', top: '35%', right: 6, width: 68, height: 'auto', zIndex: 5 }} />
            <CoatOfArms style={{ position: 'absolute', bottom: 6, left: 6, width: 68, height: 'auto', zIndex: 5 }} />
            <HolographicOverlay />
          </div>
        </div>

        {/* QR consent card — floating with padding */}
        <div className="w-[50%] flex items-center justify-center relative" style={{ zIndex: 2, padding: '14px 10px 14px 6px' }}>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm flex flex-col justify-center gap-3 w-full h-full">
            <p className="text-[11px] text-gray-500 leading-snug">
              Presenting a QR code allows your driver licence information to be scanned and shared.
            </p>
            <p className="text-[13px] font-bold text-gray-900 leading-snug">
              Do you consent to share your information?
            </p>
            <button
              onClick={() => { setQrLoading(true); setShowQR(true); setTimeout(() => setQrLoading(false), 1200); }}
              className="bg-gray-900 text-white font-bold rounded-full w-full"
              style={{ padding: '12px 8px', fontSize: '14px' }}
            >
              Reveal QR code
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-4 pb-3 bg-white">
        <div className="flex rounded-full p-1" style={{ border: '1.5px solid #e5e5ea' }}>
          {[
            { key: 'licence', label: pPlateColor === 'learner' ? 'Permit' : 'Licence' },
            { key: 'identity', label: 'Identity' },
            { key: 'age', label: 'Age' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="flex-1 py-2 rounded-full text-[15px] font-semibold transition-all"
              style={{
                backgroundColor: activeTab === key ? '#1a1f3a' : 'transparent',
                color: activeTab === key ? '#ffffff' : '#8e8e93',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* LICENCE TAB */}
      {activeTab === 'licence' && (
        <div className="pb-24 bg-white">
          {/* Name header */}
          <div className="px-4 pt-5 pb-4 bg-white">
            <h2 className="text-[20px] font-bold text-[#1a1f3a] mb-1">{fullName}</h2>
          </div>

          {/* Licence number + Expiry */}
          <div className="px-4 bg-white grid grid-cols-2 gap-4 pb-5 ">
            <div className="pt-4">
              <p className="text-[13px] text-[#8e8e93] font-normal mb-1">Licence number</p>
              <p className="text-[16px] font-bold text-[#1a1f3a]">{licenceNumber}</p>
            </div>
            <div className="pt-4">
              <p className="text-[13px] text-[#8e8e93] font-normal mb-1">Expiry</p>
              <p className="text-[16px] font-bold text-[#1a1f3a]">{expiry}</p>
            </div>
          </div>

          {/* Licence type + DOB */}
          <div className="px-4 bg-white grid grid-cols-2 gap-4 py-5 border-b border-[#e5e5ea]">
            <div>
              <p className="text-[13px] text-[#8e8e93] font-normal mb-1">Licence type</p>
              <div className="flex items-center gap-2">
                <p className="text-[16px] font-bold text-[#1a1f3a]">Car</p>
                <span className="w-6 h-6 rounded flex items-center justify-center text-white text-[11px] font-bold" style={{ backgroundColor: '#c62828' }}>P</span>
              </div>
            </div>
            <div>
              <p className="text-[13px] text-[#8e8e93] font-normal mb-1">Date of birth</p>
              <p className="text-[16px] font-bold text-[#1a1f3a]">{dob}</p>
            </div>
          </div>

          {/* Address */}
          <div className="px-4 bg-white py-5 border-b border-[#e5e5ea]">
            <p className="text-[13px] text-[#8e8e93] font-normal mb-1">Address</p>
            <p className="text-[16px] font-bold text-[#1a1f3a]">{formattedAddr.line1}</p>
            {formattedAddr.line2 && <p className="text-[16px] font-bold text-[#1a1f3a]">{formattedAddr.line2}</p>}
          </div>

          {/* Signature */}
          <div className="px-4 bg-white py-5 border-b border-[#e5e5ea]">
            <p className="text-[13px] text-[#8e8e93] font-normal mb-1">Signature</p>
            {data.signature ? (
              <img src={data.signature} alt="signature" className="h-16 object-contain" />
            ) : (
              <p className="text-[14px] text-gray-400 italic">No signature on file</p>
            )}
          </div>

          {/* Car licence details section header */}
          <div className="px-4 py-3 mt-2 bg-[#f2f2f7]">
            <p className="text-[14px] font-medium text-[#1a1f3a]">Car licence details</p>
          </div>

          {/* Licence status */}
          <div className="px-4 bg-white py-4 ">
            <p className="text-[13px] text-[#8e8e93] font-normal mb-1.5">Licence status</p>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 12 12" width="10" height="10" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-[16px] font-bold text-[#1a1f3a]">Current</p>
            </div>
          </div>

          {/* Proficiency */}
          <div className="px-4 bg-white py-4 ">
            <p className="text-[13px] text-[#8e8e93] font-normal mb-1.5">Proficiency</p>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0" style={{ backgroundColor: '#c62828' }}>P</span>
              <p className="text-[16px] font-bold text-[#1a1f3a]">P1</p>
            </div>
          </div>

          {/* Issue date */}
          <div className="px-4 bg-white py-4 ">
            <p className="text-[13px] text-[#8e8e93] font-normal mb-1">Issue date</p>
            <p className="text-[16px] font-bold text-[#1a1f3a]">{data.issueDate || '28 Feb 2026'}</p>
          </div>

          {/* P1 end date */}
          <div className="px-4 bg-white py-4 ">
            <p className="text-[13px] text-[#8e8e93] font-normal mb-1">P1 end date</p>
            <p className="text-[16px] font-bold text-[#1a1f3a]">{data.p1EndDate || '28 Feb 2027'}</p>
          </div>

          {/* Expiry */}
          <div className="px-4 bg-white py-4">
            <p className="text-[13px] text-[#8e8e93] font-normal mb-1">Expiry</p>
            <p className="text-[16px] font-bold text-[#1a1f3a]">{expiry}</p>
          </div>

          {/* Other details section header */}
          <div className="px-4 py-3 mt-2 bg-[#f2f2f7]">
            <p className="text-[14px] font-medium text-[#1a1f3a]">Other details</p>
          </div>

          {/* Conditions */}
          <div className="px-4 bg-white py-4 ">
            <p className="text-[13px] text-[#8e8e93] font-normal mb-1">Conditions</p>
            <p className="text-[16px] font-bold text-[#1a1f3a]">A&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Automatic transmission - (car)</p>
          </div>

          {/* Card number */}
          <div className="px-4 bg-white py-4 ">
            <p className="text-[13px] text-[#8e8e93] font-normal mb-1">Card number</p>
            <div className="flex items-center justify-between">
              <p className="text-[16px] font-bold text-[#1a1f3a]">
                {showCardNumber ? (data.cardNumber || 'Not set') : '*******'}
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
            <p className="text-[13px] text-[#8e8e93] font-normal mb-1">Victoria Police barcode</p>
            <Barcode value={licenceNumber} />
          </div>
        </div>
      )}

      {/* IDENTITY TAB */}
      {activeTab === 'identity' && (
        <div className="px-4 pt-5 pb-24 bg-white">
          <h2 className="text-[20px] font-bold text-[#1a1f3a] mb-5">{fullName}</h2>

          {/* Address */}
          <div className="pb-5 ">
            <p className="text-[13px] text-[#8e8e93] font-normal mb-1">Address</p>
            <p className="text-[16px] font-bold text-[#1a1f3a]">{formattedAddr.line1}</p>
            {formattedAddr.line2 && <p className="text-[16px] font-bold text-[#1a1f3a]">{formattedAddr.line2}</p>}
          </div>

          {/* Signature */}
          <div className="pt-5">
            <p className="text-[13px] text-[#8e8e93] font-normal mb-1">Signature</p>
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
          <h2 className="text-[20px] font-bold text-[#1a1f3a] mb-5">{fullName}</h2>

          <div>
            <p className="text-[13px] text-[#8e8e93] font-normal mb-1">Age status</p>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 12 12" width="10" height="10" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-[16px] font-bold text-[#1a1f3a]">Over 18</p>
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
                    <div style={{
                      width: 120, height: 120, borderRadius: '50%',
                      background: 'radial-gradient(circle at 35% 35%, #4caf50, #2e7d32)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 6px 24px rgba(0,0,0,0.25)',
                    }}>
                      <svg width="64" height="64" viewBox="0 0 64 64" fill="none"
                        style={{ animation: 'spin 0.9s linear infinite', transformOrigin: '32px 32px' }}>
                        <circle cx="32" cy="32" r="22" stroke="rgba(255,255,255,0.2)" strokeWidth="5" fill="none"/>
                        <path d="M 32 10 A 22 22 0 1 1 10 32" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none"/>
                      </svg>
                    </div>
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