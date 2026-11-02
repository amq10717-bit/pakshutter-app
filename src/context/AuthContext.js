import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(!!auth);

  useEffect(() => {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        setIsAdmin(false);
        setChecking(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db, 'admins', u.uid));
        setIsAdmin(snap.exists());
      } catch (e) {
        setIsAdmin(false);
      }
      setChecking(false);
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAdmin,
      checking,
      login: async (email, password) => {
        if (!auth) throw new Error('not-configured');
        setChecking(true);
        try {
          const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
          const snap = await getDoc(doc(db, 'admins', cred.user.uid));
          if (!snap.exists()) {
            await signOut(auth);
            const err = new Error('not-admin');
            err.code = 'not-admin';
            throw err;
          }
          setIsAdmin(true);
          return cred.user;
        } finally {
          setChecking(false);
        }
      },
      logout: () => (auth ? signOut(auth) : Promise.resolve()),
      resetPassword: (email) => sendPasswordResetEmail(auth, email.trim()),
    }),
    [user, isAdmin, checking],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export function authErrorMessage(e) {
  const code = (e && (e.code || e.message)) || '';
  if (code.includes('not-admin')) return 'This account does not have admin access.';
  if (code.includes('not-configured')) return 'Firebase is not connected yet.';
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found'))
    return 'Incorrect email or password.';
  if (code.includes('invalid-email')) return 'Please enter a valid email address.';
  if (code.includes('too-many-requests')) return 'Too many attempts. Please wait a few minutes and try again.';
  if (code.includes('network')) return 'No internet connection. Please check and try again.';
  return 'Login failed. Please try again.';
}
