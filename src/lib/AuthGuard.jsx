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
        <div className="w-8 h-8 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (state === 'unauthenticated') return <Navigate to="/login" replace />;
  if (state === 'pending') return <Navigate to="/pending" replace />;
  if (state === 'rejected') return <Navigate to="/login" replace />;

  return children;
}
