import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Upload, X } from 'lucide-react';
import { useLicenceData } from '../lib/licenceData';

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h2 className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wide mb-3 px-1">{title}</h2>
      <div className="bg-card rounded-2xl p-5 border border-border space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-[13px] font-medium text-muted-foreground mb-1 block">{label}</label>
      <input
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
    </div>
  );
}

export default function HelpAndInfo() {
  const navigate = useNavigate();
  const { data, setData } = useLicenceData();
  const [form, setForm] = useState({ ...data });
  const photoRef = useRef();
  const sigRef = useRef();

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (field, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => handleChange(field, ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setData(form);
    navigate(-1);
  };

  return (
    <div className="px-5 pt-8 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1">
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="text-[22px] font-bold text-foreground">Edit Licence Info</h1>
      </div>

      {/* Photo upload */}
      <Section title="Profile Photo">
        <button
          onClick={() => photoRef.current.click()}
          className="w-full h-40 rounded-xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden relative"
        >
          {form.photo ? (
            <>
              <img src={form.photo} alt="profile" className="w-full h-full object-cover" />
              <button
                onClick={(e) => { e.stopPropagation(); handleChange('photo', null); }}
                className="absolute top-2 right-2 bg-black/50 rounded-full p-1"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Upload className="w-6 h-6" />
              <span className="text-sm">Tap to upload photo</span>
            </div>
          )}
        </button>
        <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload('photo', e)} />
      </Section>

      {/* Signature upload */}
      <Section title="Signature">
        <button
          onClick={() => sigRef.current.click()}
          className="w-full h-24 rounded-xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden relative"
        >
          {form.signature ? (
            <>
              <img src={form.signature} alt="signature" className="h-full object-contain" />
              <button
                onClick={(e) => { e.stopPropagation(); handleChange('signature', null); }}
                className="absolute top-2 right-2 bg-black/50 rounded-full p-1"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Upload className="w-5 h-5" />
              <span className="text-sm">Tap to upload signature</span>
            </div>
          )}
        </button>
        <input ref={sigRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload('signature', e)} />
      </Section>

      {/* Fields */}
      <Section title="Personal Details">
        <Field label="First Name" value={form.firstName} onChange={(v) => handleChange('firstName', v)} placeholder="e.g. Alex" />
        <Field label="Full Name" value={form.fullName} onChange={(v) => handleChange('fullName', v)} placeholder="e.g. ALEX JAMES SMITH" />
        <Field label="Demerit Balance" value={form.demeritBalance} onChange={(v) => handleChange('demeritBalance', v)} placeholder="e.g. 0" />
        <Field label="Demerit Threshold" value={form.demeritThreshold} onChange={(v) => handleChange('demeritThreshold', v)} placeholder="e.g. 5" />
        <Field label="Permit Number" value={form.permitNumber} onChange={(v) => handleChange('permitNumber', v)} placeholder="e.g. 12345678" />
        <Field label="Date of Birth" value={form.dob} onChange={(v) => handleChange('dob', v)} placeholder="e.g. 01 Jan 2000" />
        <Field label="Address" value={form.address} onChange={(v) => handleChange('address', v)} placeholder="e.g. 123 Main St, Melbourne VIC 3000" />
        <Field label="P1 End Date" value={form.p1EndDate} onChange={(v) => handleChange('p1EndDate', v)} placeholder="e.g. 23 Aug 2027" />
        <Field label="Card Number" value={form.cardNumber} onChange={(v) => handleChange('cardNumber', v)} placeholder="e.g. 1234567890" />
        <Field label="Conditions" value={form.conditions} onChange={(v) => handleChange('conditions', v)} placeholder="e.g. Must wear corrective lenses" />
      </Section>

      <button
        onClick={handleSave}
        className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-[15px]"
      >
        Save Changes
      </button>
    </div>
  );
}