import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [form, setForm] = useState({ ...data });
  const photoRef = useRef();

  // Sync form when data loads from localStorage
  useEffect(() => {
    if (data.fullName || data.firstName || data.licenceNumber) {
      setForm({ ...data });
    }
  }, [data.fullName, data.firstName, data.licenceNumber]);

  const set = (field) => (value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleImage = (field) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(prev => ({ ...prev, [field]: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setData(form);
    navigate(-1);
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

      <button
        onClick={handleSave}
        className="w-full py-3.5 rounded-2xl bg-gray-900 text-white font-semibold text-[15px]"
      >
        Save changes
      </button>
    </div>
  );
}