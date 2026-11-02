// Paste your Firebase web app config here (Firebase console → Project settings →
// Your apps → Web app → SDK setup and configuration → Config).
// Until this is filled in, the app runs with the built-in website content and
// quote requests are sent through WhatsApp instead of being saved.

export const firebaseConfig = {
  apiKey: 'AIzaSyCD7qgNz-72O2EojbMoCfXokfzTe07oY5k',
  authDomain: 'pak-shutter-1ef6c.firebaseapp.com',
  projectId: 'pak-shutter-1ef6c',
  storageBucket: 'pak-shutter-1ef6c.firebasestorage.app',
  messagingSenderId: '78022416095',
  appId: '1:78022416095:web:76fc01aab7426591a7bb6a',
};

export const isFirebaseConfigured =
  !!firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('PASTE') &&
  !!firebaseConfig.projectId && !firebaseConfig.projectId.startsWith('PASTE');
