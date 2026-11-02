import { Platform } from 'react-native';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import * as FirebaseAuth from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseConfig, isFirebaseConfigured } from '../config/firebaseConfig';

let app = null;
let db = null;
let auth = null;

if (isFirebaseConfigured) {
  const firstInit = getApps().length === 0;
  app = firstInit ? initializeApp(firebaseConfig) : getApp();

  try {
    // Long polling is more reliable on mobile networks with React Native.
    db = firstInit ? initializeFirestore(app, { experimentalAutoDetectLongPolling: true }) : getFirestore(app);
  } catch (_e) {
    db = getFirestore(app);
  }

  try {
    // getReactNativePersistence only exists in Firebase's React Native build
    const { getReactNativePersistence } = Platform.OS !== 'web' ? require('firebase/auth') : {};
    if (typeof getReactNativePersistence === 'function') {
      auth = FirebaseAuth.initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
    } else {
      auth = FirebaseAuth.getAuth(app);
    }
  } catch (_e) {
    // initializeAuth throws if already initialized (e.g. fast refresh)
    auth = FirebaseAuth.getAuth(app);
  }
}

export { app, db, auth, isFirebaseConfigured };
