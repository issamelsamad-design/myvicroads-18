import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { ArrowLeft, Check, X, Clock, UserCheck, UserX } from 'lucide-react';

export default function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      // Sort: pending first, then approved, then rejected — alphabetical by name within each group
      list.sort((a, b) => {
        const order = { pending: 0, approved: 1, rejected: 2 };
        const byStatus = (order[a.status] ?? 3) - (order[b.status] ?? 3);
        if (byStatus !== 0) return byStatus;
        return (a.name || a.email || '').localeCompare(b.name || b.email || '', undefined, { sensitivity: 'base' });
      });
      setUsers(list);
    });
    return () => unsub();
  }, []);

  const updateStatus = async (uid, status) => {
    await updateDoc(doc(db, 'users', uid), { status });
  };

  const pendingCount = users.filter((u) => u.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <button onClick={() => navigate('/admin')} className="p-1">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-[17px] font-semibold text-gray-900 flex-1 text-center pr-7">User Management</h1>
      </div>

      {/* Pending alert */}
      {pendingCount > 0 && (
        <div className="mx-4 mt-4 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800 font-medium">
            {pendingCount} user{pendingCount > 1 ? 's' : ''} waiting for approval
          </p>
        </div>
      )}

      {/* User list */}
      <div className="px-4 mt-4 space-y-3 pb-8">
        {users.length === 0 ? (
          <p className="text-center text-gray-400 text-sm mt-12">No users yet</p>
        ) : (
          users.map((user) => (
            <div key={user.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-gray-900 truncate">{user.name || 'Unknown'}</p>
                  <p className="text-[13px] text-gray-500 truncate">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      user.status === 'approved' ? 'bg-green-100 text-green-700' :
                      user.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {user.status === 'approved' && <UserCheck className="w-3 h-3" />}
                      {user.status === 'rejected' && <UserX className="w-3 h-3" />}
                      {user.status === 'pending' && <Clock className="w-3 h-3" />}
                      {user.status}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      via {user.method === 'google.com' ? 'Google' : 'Email'}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 ml-3">
                  {user.status !== 'approved' && (
                    <button
                      onClick={() => updateStatus(user.id, 'approved')}
                      className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center hover:bg-green-200 transition-colors"
                      title="Approve"
                    >
                      <Check className="w-4 h-4 text-green-700" />
                    </button>
                  )}
                  {user.status !== 'rejected' && (
                    <button
                      onClick={() => updateStatus(user.id, 'rejected')}
                      className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors"
                      title="Reject"
                    >
                      <X className="w-4 h-4 text-red-700" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
