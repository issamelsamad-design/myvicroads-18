import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

export function AuthGuard({ children }) {
  const [state, setState] = useState('loading');

  useEffect(() => {
    let unsubFirestore = null;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setState('unauthenticated');
        return;
      }
      // Real-time listener - auto-updates when admin approves
      unsubFirestore = onSnapshot(doc(db, 'users', user.uid), (snap) => {
        if (snap.exists()) {
          setState(snap.data().status);
        } else {
          setState('pending');
        }
      }, () => {
        setState('unauthenticated');
      });
    });

    return () => {
      unsubAuth();
      if (unsubFirestore) unsubFirestore();
    };
  }, []);

  if (state === 'loading') {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)' }}>
        <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #4caf50, #2e7d32)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(46,125,50,0.35)' }}>
          <svg width="52" height="52" viewBox="0 0 64 64" fill="none" style={{ animation: 'spin 0.9s linear infinite', transformOrigin: '32px 32px' }}>
            <circle cx="32" cy="32" r="22" stroke="rgba(255,255,255,0.2)" strokeWidth="5" fill="none"/>
            <path d="M 32 10 A 22 22 0 1 1 10 32" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none"/>
          </svg>
        </div>
      </div>
    );
  }

  if (state === 'unauthenticated') return <Navigate to="/login" replace />;
  if (state === 'pending') return <Navigate to="/pending" replace />;
  if (state === 'rejected') return <Navigate to="/login" replace />;

  return children;
}
