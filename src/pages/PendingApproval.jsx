import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

export default function PendingApproval() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) { navigate('/login'); return; }

    // Listen for real-time status changes
    const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.status === 'approved') {
          navigate('/home');
        } else if (data.status === 'rejected') {
          setStatus('rejected');
        }
      }
    });

    return () => unsub();
  }, [navigate]);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#ffffff' }}>
      <div className="w-full max-w-sm text-center">
        {status === 'rejected' ? (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-sm text-gray-500 mb-6">Your request to access myVicRoads has been declined.</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Pending Approval</h1>
            <p className="text-sm text-gray-500 mb-2">Your account is waiting for admin approval.</p>
            <p className="text-sm text-gray-400 mb-6">You'll be redirected automatically once approved.</p>
          </>
        )}

        <button
          onClick={handleSignOut}
          className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
