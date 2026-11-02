// Paste your Firebase web app config here (Firebase console → Project settings →
// Your apps → Web app → SDK setup and configuration → Config).
// Until this is filled in, the app runs with the built-in website content and
// quote requests are sent through WhatsApp instead of being saved.

export const firebaseConfig = {
  apiKey: 'PASTE_API_KEY',
  authDomain: 'PASTE_PROJECT_ID.firebaseapp.com',
  projectId: 'PASTE_PROJECT_ID',
  storageBucket: 'PASTE_PROJECT_ID.firebasestorage.app',
  messagingSenderId: 'PASTE_SENDER_ID',
  appId: 'PASTE_APP_ID',
};

export const isFirebaseConfigured =
  !!firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('PASTE') &&
  !!firebaseConfig.projectId && !firebaseConfig.projectId.startsWith('PASTE');
