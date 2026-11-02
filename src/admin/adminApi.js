import { collection, deleteDoc, doc, getDocs, limit, query, setDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DEFAULT_BUSINESS } from '../data/defaults';
import { SCHEMAS } from './schemas';

const strip = (obj) => {
  const out = {};
  Object.keys(obj).forEach((k) => {
    if (k === 'id' || obj[k] === undefined) return;
    out[k] = obj[k];
  });
  return out;
};

/** Copies the built-in website content into an empty collection. */
export async function seedCollection(kind) {
  const schema = SCHEMAS[kind];
  const existing = await getDocs(query(collection(db, schema.collection), limit(1)));
  if (!existing.empty) return false;
  const batch = writeBatch(db);
  schema.defaults.forEach((item) => {
    batch.set(doc(db, schema.collection, item.id), { ...strip(item), updatedAt: serverTimestamp() });
  });
  await batch.commit();
  return true;
}

export async function seedAll() {
  const results = [];
  for (const kind of ['services', 'shutterTypes', 'gallery', 'testimonials']) {
    results.push(await seedCollection(kind));
  }
  await setDoc(doc(db, 'settings', 'business'), { ...DEFAULT_BUSINESS, updatedAt: serverTimestamp() }, { merge: true });
  return results;
}

export async function saveItem(kind, id, data) {
  const schema = SCHEMAS[kind];
  // Make sure the other website items are kept when the first edit is saved
  await seedCollection(kind);
  const ref = id ? doc(db, schema.collection, id) : doc(collection(db, schema.collection));
  await setDoc(ref, { ...strip(data), updatedAt: serverTimestamp() });
  return ref.id;
}

export async function deleteItem(kind, id) {
  const schema = SCHEMAS[kind];
  await seedCollection(kind);
  await deleteDoc(doc(db, schema.collection, id));
}

export async function saveBusiness(data) {
  await setDoc(doc(db, 'settings', 'business'), { ...strip(data), updatedAt: serverTimestamp() }, { merge: true });
}

export function friendlyError(e) {
  const code = (e && (e.code || e.message)) || '';
  if (code.includes('permission')) return 'Permission denied. Make sure you are logged in as admin and the Firestore rules are published.';
  if (code.includes('unavailable') || code.includes('network')) return 'No internet connection. Please try again.';
  if (code.includes('too large') || code.includes('exceeds')) return 'This photo is too large. Please choose a smaller photo.';
  return 'Something went wrong. Please try again.';
}
