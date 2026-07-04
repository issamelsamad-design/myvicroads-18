import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, RefreshCw } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';

const STATUS_STYLES = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700' },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-700' },
  denied: { label: 'Denied', color: 'bg-red-100 text-red-700' },
};

export default function AccessRequestsPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'users'));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setUsers(data.sort((a, b) => (a.status === 'pending' ? -1 : 1)));
    } catch {
      setUsers([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (userId, status) => {
    setActionLoading(userId);
    try {
      await updateDoc(doc(db, 'users', userId), { status });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
    } catch (e) {
      alert('Failed to update. Try again.');
    }
    setActionLoading(null);
  };

  const byName = (a, b) =>
    (a.name || a.email || '').localeCompare(b.name || b.email || '', undefined, { sensitivity: 'base' });
  const pending = users.filter(u => u.status === 'pending').sort(byName);
  const others = users.filter(u => u.status !== 'pending').sort(byName);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[16px] font-bold text-gray-900">Access Requests</h2>
          {pending.length > 0 && (
            <p className="text-[12px] text-amber-600 font-medium">{pending.length} pending</p>
          )}
        </div>
        <button onClick={load} className="p-2 rounded-xl bg-gray-100">
          <RefreshCw className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {users.length === 0 && (
        <p className="text-[13px] text-gray-400 text-center py-8">No users yet.</p>
      )}

      {pending.map(user => (
        <div key={user.id} className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-3">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0">
              <p className="text-[15px] font-semibold text-gray-900 truncate">{user.name || 'Unknown'}</p>
              <p className="text-[13px] text-gray-500 truncate">{user.email}</p>
            </div>
            <span className="flex-shrink-0 text-[11px] font-semibold px-2 py-1 rounded-full bg-amber-100 text-amber-700 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Pending
            </span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => updateStatus(user.id, 'approved')} disabled={actionLoading === user.id} className="flex-1 py-2.5 rounded-xl bg-gray-900 text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50">
              <CheckCircle2 className="w-4 h-4" />
              {actionLoading === user.id ? 'Updating...' : 'Approve'}
            </button>
            <button onClick={() => updateStatus(user.id, 'denied')} disabled={actionLoading === user.id} className="flex-1 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-[13px] font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50">
              <XCircle className="w-4 h-4" />
              Deny
            </button>
          </div>
        </div>
      ))}

      {others.length > 0 && (
        <div className="mt-2">
          <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1">All Users</p>
          {others.map(user => (
            <div key={user.id} className="bg-white border border-gray-100 rounded-2xl p-4 mb-2 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-gray-900 truncate">{user.name || 'Unknown'}</p>
                <p className="text-[12px] text-gray-400 truncate">{user.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`flex-shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[user.status]?.color}`}>
                  {STATUS_STYLES[user.status]?.label}
                </span>
                {user.status === 'approved' && (
                  <button onClick={() => updateStatus(user.id, 'pending')} className="text-[11px] text-orange-500 font-medium px-2 py-1 rounded-lg bg-orange-50">Reset</button>
                )}
                {user.status === 'denied' && (
                  <button onClick={() => updateStatus(user.id, 'pending')} className="text-[11px] text-blue-500 font-medium px-2 py-1 rounded-lg bg-blue-50">Re-enable</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
