import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function RequestAccess() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email) return;
    setLoading(true);
    setError('');
    try {
      // Store request in localStorage for admin to review
      const existing = JSON.parse(localStorage.getItem('vicroads_access_requests') || '[]');
      const alreadyExists = existing.find(r => r.email === form.email);
      if (!alreadyExists) {
        existing.push({
          id: Date.now().toString(),
          email: form.email,
          name: form.name,
          message: form.message,
          status: 'pending',
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem('vicroads_access_requests', JSON.stringify(existing));
      }
      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#ebebf0] flex items-center justify-center px-5">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-[20px] font-bold text-gray-900 mb-2">Request Sent</h2>
          <p className="text-[14px] text-gray-500 leading-relaxed">
            Your access request has been submitted. You'll receive an invite once approved.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ebebf0] flex items-center justify-center px-5">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#c62828' }}>
            <svg viewBox="0 0 20 20" width="16" height="16" fill="white">
              <path d="M10 2L2 18h4l4-8 4 8h4L10 2z" />
            </svg>
          </div>
          <span className="font-bold text-gray-900 text-[16px]">myVicRoads</span>
        </div>

        <h1 className="text-[22px] font-bold text-gray-900 mb-1">Request Access</h1>
        <p className="text-[13px] text-gray-500 mb-6">Enter your details and we'll notify you when approved.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[13px] text-gray-500 mb-1 block">Full name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Alex Smith"
              className="w-full px-4 py-3 bg-[#f2f2f7] rounded-xl text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>
          <div>
            <label className="text-[13px] text-gray-500 mb-1 block">Email address <span className="text-red-500">*</span></label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="e.g. alex@email.com"
              className="w-full px-4 py-3 bg-[#f2f2f7] rounded-xl text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>
          <div>
            <label className="text-[13px] text-gray-500 mb-1 block">Message (optional)</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Why do you need access?"
              rows={3}
              className="w-full px-4 py-3 bg-[#f2f2f7] rounded-xl text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 resize-none"
            />
          </div>
          {error && <p className="text-[13px] text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gray-900 text-white font-semibold text-[15px] disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Request Access'}
          </button>
        </form>
      </div>
    </div>
  );
}
