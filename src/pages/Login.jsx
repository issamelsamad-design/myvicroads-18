import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, googleProvider } from '../lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function Login() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Creates the Firestore user doc if missing, returns their status
  const handleUserDoc = async (user, displayName) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        name: displayName || user.displayName || user.email?.split('@')[0] || 'User',
        status: 'pending',
        createdAt: new Date().toISOString(),
        method: user.providerData[0]?.providerId || 'email',
      });
      return 'pending';
    }
    return userSnap.data().status;
  };

  const navigateByStatus = async (user, displayName) => {
    const status = await handleUserDoc(user, displayName);
    if (status === 'approved') navigate('/', { replace: true });
    else if (status === 'rejected') {
      setError('Your access has been denied.');
      await auth.signOut();
      setLoading(false);
    } else {
      navigate('/pending', { replace: true });
    }
  };

  useEffect(() => {
    let unsubAuth = null;

    const setupAuthListener = () => {
      unsubAuth = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            await navigateByStatus(user, user.displayName);
          } catch {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      });
    };

    // Check for mobile Google redirect result first, then fall back to auth listener
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          await navigateByStatus(result.user, result.user.displayName);
        } else {
          setupAuthListener();
        }
      })
      .catch((e) => {
        if (e.code !== 'auth/popup-closed-by-user') setError(e.message);
        setLoading(false);
        setupAuthListener();
      });

    return () => { if (unsubAuth) unsubAuth(); };
  }, []);

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        // Redirect: page navigates away to Google, result is handled on return in useEffect
        await signInWithRedirect(auth, googleProvider);
      } else {
        const result = await signInWithPopup(auth, googleProvider);
        await navigateByStatus(result.user, result.user.displayName);
      }
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        setError(err.message);
      }
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let userCred;
      if (isSignUp) {
        userCred = await createUserWithEmailAndPassword(auth, email, password);
        await navigateByStatus(userCred.user, name);
      } else {
        userCred = await signInWithEmailAndPassword(auth, email, password);
        await navigateByStatus(userCred.user, null);
      }
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') setError('Email already registered. Try logging in.');
      else if (err.code === 'auth/invalid-credential') setError('Invalid email or password.');
      else if (err.code === 'auth/weak-password') setError('Password must be at least 6 characters.');
      else setError(err.message);
      setLoading(false);
    }
  };

  return loading ? (
    <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
      <div className="w-8 h-8 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin" />
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#ffffff' }}>
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mx-auto mb-3">
            <path d="M10 38L22 6" stroke="#43a047" strokeWidth="5" strokeLinecap="round"/>
            <path d="M22 6L32 26" stroke="#2e7d32" strokeWidth="5" strokeLinecap="round"/>
            <path d="M32 26L40 14" stroke="#2e7d32" strokeWidth="4" strokeLinecap="round"/>
          </svg>
          <h1 className="text-2xl font-bold text-gray-900">myVicRoads</h1>
          <p className="text-sm text-gray-500 mt-1">{isSignUp ? 'Create your account' : 'Sign in to continue'}</p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Google — primary sign-in */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full py-3.5 rounded-xl font-semibold text-[15px] bg-white border border-gray-200 text-gray-700 flex items-center justify-center gap-3 hover:bg-gray-50 disabled:opacity-50"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-1 border-t border-gray-300" />
          <span className="px-3 text-sm text-gray-400">or</span>
          <div className="flex-1 border-t border-gray-300" />
        </div>

        {/* Email / Password */}
        <form onSubmit={handleEmailAuth} className="space-y-3">
          {isSignUp && (
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            minLength={6}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-white font-semibold text-[15px] disabled:opacity-50"
            style={{ backgroundColor: '#2e7d32' }}
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        {!isSignUp && (
          <p className="text-center text-sm mt-3">
            <button
              onClick={async () => {
                if (!email) { setError('Enter your email above first.'); return; }
                try {
                  await sendPasswordResetEmail(auth, email);
                  setError('');
                  alert('Password reset email sent! Check your inbox.');
                } catch (e) {
                  setError(e.message);
                }
              }}
              className="text-green-700 font-semibold"
            >
              Forgot password?
            </button>
          </p>
        )}

        {/* Toggle sign up / sign in */}
        <p className="text-center text-sm text-gray-500 mt-6">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => { setIsSignUp(!isSignUp); setError(''); }} className="text-green-700 font-semibold">
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>

      </div>
    </div>
  );
}
