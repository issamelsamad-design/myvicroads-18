import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const defaults = {
  firstName: '',
  fullName: '',
  permitNumber: '',
  licenceNumber: '',
  dob: '',
  address: '',
  issueDate: '',
  expiryDate: '',
  p1EndDate: '',
  cardNumber: '',
  conditions: '',
  photo: null,
  signature: null,
  demeritBalance: '0',
  demeritThreshold: '5',
  pPlateColor: 'green',
};

export function useLicenceData() {
  const [data, setDataState] = useState({ ...defaults });
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setDataState({ ...defaults });
        setLoading(false);
        return;
      }

      setUserId(user.uid);

      try {
        const snap = await getDoc(doc(db, 'users', user.uid));

        if (snap.exists() && snap.data().licenceData) {
          // Load from Firestore
          setDataState({ ...defaults, ...snap.data().licenceData });
        } else {
          // First time — migrate any old localStorage data if it exists
          const oldKey = `vicroads_licence_data_${user.email}`;
          const stored = localStorage.getItem(oldKey);
          if (stored) {
            const parsed = JSON.parse(stored);
            setDataState({ ...defaults, ...parsed });
            await setDoc(doc(db, 'users', user.uid), { licenceData: parsed }, { merge: true });
            localStorage.removeItem(oldKey);
          }
        }
      } catch (err) {
        console.error('Failed to load licence data:', err);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  const setData = async (newData) => {
    setDataState(newData);
    if (userId) {
      try {
        await setDoc(doc(db, 'users', userId), { licenceData: newData }, { merge: true });
      } catch (err) {
        console.error('Failed to save licence data:', err);
      }
    }
  };

  return { data, setData, loading };
}
