import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

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

function getUserKey(email) {
  return `vicroads_licence_data_${email}`;
}

export function useLicenceData() {
  const [data, setDataState] = useState({ ...defaults });
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) return;
      setUserEmail(user.email);
      try {
        const stored = localStorage.getItem(getUserKey(user.email));
        if (stored) {
          setDataState({ ...defaults, ...JSON.parse(stored) });
        }
      } catch {}
    });
    return () => unsub();
  }, []);

  const setData = (newData) => {
    setDataState(newData);
    const key = userEmail
      ? getUserKey(userEmail)
      : 'vicroads_licence_data';
    localStorage.setItem(key, JSON.stringify(newData));
  };

  return { data, setData };
}
