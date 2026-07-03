import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage, auth } from '../lib/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../lib/AuthContext';
import { ChevronLeft, Upload, X, Trash2 } from 'lucide-react';
import { useLicenceData } from '../lib/licenceData';
import SignaturePad from '../components/vicroads/SignaturePad';

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-[13px] text-gray-500 mb-1 block">{label}</label>
      <input
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-[#f2f2f7] rounded-xl text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800"
      />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-5">
      <p className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide mb-2 px-1">{title}</p>
      <div className="bg-white rounded-2xl p-5 space-y-4 shadow-sm">{children}</div>
    </div>
  );
}

export default function EditDetails() {
  const navigate = useNavigate();
  const { data, setData } = useLicenceData();
  const { currentUser } = useAuth();
  const [holoEnabled, setHoloEnabled] = useState(() => localStorage.getItem('holo_enabled') === 'true');

  const toggleHolo = async () => {
    if (!holoEnabled) {
      if (typeof DeviceOrientationEvent !== 'undefined' &&
          typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
          const permission = await DeviceOrientationEvent.requestPermission();
          if (permission === 'granted') {
            localStorage.setItem('holo_enabled', 'true');
            setHoloEnabled(true);
          }
        } catch (e) {
          localStorage.setItem('holo_enabled', 'true');
          setHoloEnabled(true);
        }
      } else {
        localStorage.setItem('holo_enabled', 'true');
        setHoloEnabled(true);
      }
    } else {
      localStorage.setItem('holo_enabled', 'false');
      setHoloEnabled(false);
    }
  };
  const [form, setForm] = useState({ ...data });
  const photoRef = useRef();

  // Sync form when data loads from localStorage
  useEffect(() => {
    if (data.fullName || data.firstName || data.licenceNumber) {
      setForm({ ...data });
    }
  }, [data.fullName, data.firstName, data.licenceNumber]);

  const set = (field) => (value) => setForm(prev => ({ ...prev, [field]: value }));

  // Downscale + compress the image in the browser so it fits inside Firestore's
  // 1 MB document limit. This avoids needing Firebase Storage (which is off on the free plan).
  const handleImage = (field) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 700;
        let { width, height } = img;
        if (width > height && width > maxDim) { height = Math.round(height * maxDim / width); width = maxDim; }
        else if (height > maxDim) { width = Math.round(width * maxDim / height); height = maxDim; }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', 0.7);
        setForm(prev => ({ ...prev, [field]: compressed }));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      await setData(form);
      navigate(-1);
    } catch (err) {
      console.error('Save failed:', err);
      alert('Could not save. ' + (err?.message || 'Please try again.'));
    }
  };

  return (
    <div className="min-h-screen bg-[#ebebf0] px-5 pt-8 pb-10 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1">
          <ChevronLeft className="w-6 h-6 text-gray-900" />
        </button>
        <h1 className="text-[22px] font-bold text-gray-900">Edit my details</h1>
      </div>

      {/* Personal */}
      <Section title="Personal">
        <Field label="First name" value={form.firstName} onChange={set('firstName')} placeholder="e.g. Alex" />
        <Field label="Full name (as on licence)" value={form.fullName} onChange={set('fullName')} placeholder="e.g. ALEX JAMES SMITH" />
        <Field label="Date of birth" value={form.dob} onChange={set('dob')} placeholder="e.g. 18 Feb 2008" />
      </Section>

      {/* Address */}
      <Section title="Address">
        <Field
          label="Street address"
          value={(form.address || '').split('\n')[0]}
          onChange={(v) => {
            const lines = (form.address || '').split('\n');
            lines[0] = v;
            setForm(prev => ({ ...prev, address: lines.join('\n') }));
          }}
          placeholder="e.g. 372 New St"
        />
        <Field
          label="Suburb, state & postcode"
          value={(form.address || '').split('\n')[1] || ''}
          onChange={(v) => {
            const lines = (form.address || '').split('\n');
            lines[1] = v;
            setForm(prev => ({ ...prev, address: lines.filter((_, i) => i === 0 || v).join('\n') }));
          }}
          placeholder="e.g. Brighton VIC 3186"
        />
      </Section>

      {/* Licence */}
      <Section title="Licence">
        <Field label="Licence number" value={form.licenceNumber} onChange={set('licenceNumber')} placeholder="e.g. 082643104" />
        <Field label="Issue date" value={form.issueDate} onChange={set('issueDate')} placeholder="e.g. 28 Feb 2026" />
        <Field label="Expiry date" value={form.expiryDate} onChange={set('expiryDate')} placeholder="e.g. 28 Feb 2030" />
        <Field label="P1 end date" value={form.p1EndDate} onChange={set('p1EndDate')} placeholder="e.g. 28 Feb 2027" />
        <Field label="Conditions" value={form.conditions} onChange={set('conditions')} placeholder="e.g. Automatic transmission" />

        {/* P Plate colour */}
        <div>
          <label className="text-[13px] text-gray-500 mb-2 block">P plate colour</label>
          <div className="flex gap-3">
            <button
              onClick={() => setForm(prev => ({ ...prev, pPlateColor: 'green' }))}
              className={`flex-1 py-2.5 rounded-xl text-[14px] font-semibold border-2 transition-all ${
                form.pPlateColor !== 'red' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-green-600 border-green-300'
              }`}
            >Green (P2)</button>
            <button
              onClick={() => setForm(prev => ({ ...prev, pPlateColor: 'red' }))}
              className={`flex-1 py-2.5 rounded-xl text-[14px] font-semibold border-2 transition-all ${
                form.pPlateColor === 'red' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-red-600 border-red-300'
              }`}
            >Red (P1)</button>
          </div>
        </div>
      </Section>

      {/* Demerit Points */}
      <Section title="Demerit Points">
        <Field label="Balance" value={form.demeritBalance} onChange={set('demeritBalance')} placeholder="e.g. 0" />
        <Field label="Threshold" value={form.demeritThreshold} onChange={set('demeritThreshold')} placeholder="e.g. 5" />
      </Section>

      {/* Photo */}
      <Section title="Photo">
        <button
          onClick={() => photoRef.current.click()}
          className="w-full h-36 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative bg-[#f2f2f7]"
        >
          {form.photo ? (
            <>
              <img src={form.photo} alt="profile" className="w-full h-full object-cover" />
              <button
                onClick={(e) => { e.stopPropagation(); setForm(prev => ({ ...prev, photo: null })); }}
                className="absolute top-2 right-2 bg-black/50 rounded-full p-1"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <Upload className="w-5 h-5" />
              <span className="text-[13px]">Tap to upload photo</span>
            </div>
          )}
        </button>
        <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handleImage('photo')} />
      </Section>

      {/* Signature */}
      <Section title="Signature">
        <SignaturePad
          value={form.signature}
          onChange={(val) => setForm(prev => ({ ...prev, signature: val }))}
        />
      </Section>

      <div className="flex items-center justify-between bg-white rounded-2xl px-4 py-3 mb-3 border border-gray-100">
        <div>
          <p className="text-[15px] font-semibold text-gray-900">✦ Holographic Effect</p>
          <p className="text-[12px] text-gray-400 mt-0.5">Shimmer follows phone tilt on licence</p>
        </div>
        <button onClick={toggleHolo} style={{
          width: 44, height: 26, borderRadius: 13,
          background: holoEnabled ? '#2e7d32' : '#d1d1d6',
          position: 'relative', transition: 'background 0.2s', border: 'none', cursor: 'pointer',
          flexShrink: 0,
        }}>
          <div style={{
            position: 'absolute', top: 3,
            left: holoEnabled ? 21 : 3,
            width: 20, height: 20, borderRadius: '50%',
            background: 'white', transition: 'left 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }} />
        </button>
      </div>

      <button
        onClick={() => handleSave()}
        className="w-full py-3.5 rounded-2xl bg-gray-900 text-white font-semibold text-[15px]"
      >
        Save changes
      </button>
    </div>
  );
}