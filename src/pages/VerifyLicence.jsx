export default function VerifyLicence() {
  const now = new Date();
  const verifiedAt = now.toLocaleDateString('en-AU', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' + now.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();

  // Decode licence data from QR code URL
  let person = null;
  try {
    const params = new URLSearchParams(window.location.search);
    const d = params.get('d');
    if (d) {
      person = JSON.parse(decodeURIComponent(escape(atob(d))));
    }
  } catch {
    // invalid data
  }

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

  const addr = person ? formatAddress(person.address) : null;

  return (
    <div className="min-h-screen bg-white max-w-lg mx-auto font-sans">
      {/* Top bar with Close button */}
      <div className="flex items-center justify-between px-5 pt-12 pb-2">
        <button
          onClick={() => window.location.href = 'https://www.vicroads.vic.gov.au/online-services/login'}
          className="text-[15px] font-medium text-[#1a1f3a]"
        >
          Close
        </button>
      </div>

      {/* Verified header */}
      <div className="flex flex-col items-center pt-4 pb-6 px-6">
        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>
        <h1 className="text-[22px] font-bold text-gray-900">Licence Verified</h1>
      </div>

      {/* Licence header bar — colour based on type */}
      {(() => {
        const isLearner = person?.pPlateColor === 'learner';
        const headerBg = isLearner ? '#f5c800' : '#c8102e';
        const headerLabel = isLearner ? 'LEARNER PERMIT' : 'PROBATIONARY DRIVER LICENCE';
        const textColor = isLearner ? '#1c1c1e' : '#ffffff';
        const subColor = isLearner ? 'rgba(28,28,30,0.7)' : 'rgba(255,255,255,0.8)';
        return (
          <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: headerBg }}>
            <div>
              <p className="font-bold text-[13px] tracking-wide" style={{ color: textColor }}>{headerLabel}</p>
              <p className="text-[12px]" style={{ color: subColor }}>Victoria Australia</p>
            </div>
            <img src="/vicroads-logo-white.png" alt="VicRoads" style={{ height: 24, objectFit: 'contain', filter: isLearner ? 'invert(1)' : 'none' }} onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
        );
      })()}

      {person ? (
        <div className="px-5 pt-6 pb-10">
          {/* Photo */}
          {person.photo && (
            <div className="flex justify-center mb-6">
              <img
                src={person.photo}
                alt="Licence photo"
                className="w-32 h-40 object-cover rounded-xl border border-gray-200 shadow"
              />
            </div>
          )}

          <p className="text-[13px] font-semibold text-gray-400 uppercase tracking-wide mb-4">Licence details</p>

          {/* Name */}
          <div className="mb-5 pb-5 border-b border-gray-100">
            <p className="text-[12px] text-gray-400 mb-1">Full name</p>
            <p className="text-[18px] font-black text-gray-900">{person.name || '—'}</p>
          </div>

          {/* DOB */}
          <div className="mb-5 pb-5 border-b border-gray-100">
            <p className="text-[12px] text-gray-400 mb-1">Date of birth</p>
            <p className="text-[16px] font-semibold text-gray-900">{person.dob || '—'}</p>
          </div>

          {/* Address */}
          <div className="mb-5 pb-5 border-b border-gray-100">
            <p className="text-[12px] text-gray-400 mb-1">Address</p>
            <p className="text-[16px] font-semibold text-gray-900">{addr.line1}</p>
            {addr.line2 && <p className="text-[16px] font-semibold text-gray-900">{addr.line2}</p>}
          </div>

          {/* Licence number + Expiry */}
          <div className="grid grid-cols-2 gap-4 mb-5 pb-5 border-b border-gray-100">
            <div>
              <p className="text-[12px] text-gray-400 mb-1">Licence number</p>
              <p className="text-[15px] font-semibold text-gray-900">{person.licenceNumber || '—'}</p>
            </div>
            <div>
              <p className="text-[12px] text-gray-400 mb-1">Expiry</p>
              <p className="text-[15px] font-semibold text-gray-900">{person.expiry || '—'}</p>
            </div>
          </div>

          {/* Status */}
          <div className="mb-5 pb-5 border-b border-gray-100">
            <p className="text-[12px] text-gray-400 mb-1.5">Licence status</p>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 12 12" width="10" height="10" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-[16px] font-semibold text-gray-900">Current</p>
            </div>
          </div>

          {/* Proficiency */}
          <div className="mb-5 pb-5 border-b border-gray-100">
            <p className="text-[12px] text-gray-400 mb-1.5">Proficiency</p>
            <div className="flex items-center gap-2">
              {(() => {
                const p = person.pPlateColor;
                const bg = p === 'learner' ? '#f5c800' : p === 'red' ? '#c8102e' : '#3a7c3a';
                const fg = p === 'learner' ? '#1c1c1e' : '#ffffff';
                const letter = p === 'learner' ? 'L' : 'P';
                const label = p === 'learner' ? 'Learner' : p === 'red' ? 'P1' : 'P2';
                return (<>
                  <span className="w-6 h-6 rounded flex items-center justify-center text-[11px] font-bold" style={{ backgroundColor: bg, color: fg }}>{letter}</span>
                  <p className="text-[16px] font-semibold text-gray-900">{label}</p>
                </>);
              })()}
            </div>
          </div>

          {/* P1 End Date */}
          {person.p1EndDate && (
            <div className="mb-5 pb-5 border-b border-gray-100">
              <p className="text-[12px] text-gray-400 mb-1">P1 end date</p>
              <p className="text-[16px] font-semibold text-gray-900">{person.p1EndDate}</p>
            </div>
          )}

          {/* Conditions */}
          {person.conditions && (
            <div className="mb-5 pb-5 border-b border-gray-100">
              <p className="text-[12px] text-gray-400 mb-1">Conditions</p>
              <p className="text-[16px] font-semibold text-gray-900">{person.conditions}</p>
            </div>
          )}

          {/* Signature */}
          {person.signature && (
            <div className="mb-5">
              <p className="text-[12px] text-gray-400 mb-2">Signature</p>
              <img src={person.signature} alt="signature" className="h-14 object-contain" />
            </div>
          )}
        </div>
      ) : (
        <div className="px-5 pt-6">
          <p className="text-[13px] font-semibold text-gray-400 uppercase tracking-wide mb-4">Licence details</p>
          <div className="mb-5">
            <p className="text-[12px] text-gray-400 mb-1">Licence status</p>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 12 12" width="10" height="10" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-[16px] font-semibold text-gray-900">Current</p>
            </div>
          </div>
          <div className="mb-5">
            <p className="text-[12px] text-gray-400 mb-1">Issuing authority</p>
            <p className="text-[16px] font-semibold text-gray-900">VicRoads — Victoria, Australia</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-col items-center py-8 mt-4">
        <p className="text-[11px] text-gray-400 mb-2">Details verified with</p>
        <img
          src="/vicroads-logo.png"
          alt="VicRoads"
          style={{ width: 70, height: 22, objectFit: 'contain' }}
          className="mb-1"
        />
        <p className="text-[11px] text-gray-400">{verifiedAt}</p>
      </div>
    </div>
  );
}