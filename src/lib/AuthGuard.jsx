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
      <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'conic-gradient(from 0deg, rgba(67,160,71,0) 0%, #43a047 100%)', WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 5px))', mask: 'radial-gradient(farthest-side, transparent calc(100% - 5px), #000 calc(100% - 5px))', animation: 'spin 0.8s linear infinite' }} />
      </div>
    );
  }

  if (state === 'unauthenticated') return <Navigate to="/login" replace />;
  if (state === 'pending') return <Navigate to="/pending" replace />;
  if (state === 'rejected') return <Navigate to="/login" replace />;

  return children;
}
