// Photos uploaded by the admin are resized and stored in Firestore ("media"
// collection) so the app works on Firebase's free Spark plan, which no longer
// includes Cloud Storage for new projects. Content fields store "media:<id>".
import { Platform } from 'react-native';
import { addDoc, collection, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { db } from './firebase';

const cache = new Map();
const pending = new Map();

export const isMediaRef = (v) => typeof v === 'string' && v.startsWith('media:');

export async function resolveImage(value) {
  if (!value) return null;
  if (!isMediaRef(value)) return value;
  const id = value.slice(6);
  if (cache.has(id)) return cache.get(id);
  if (!db) return null;
  if (!pending.has(id)) {
    pending.set(
      id,
      getDoc(doc(db, 'media', id))
        .then((snap) => {
          const data = snap.exists() ? snap.data().data : null;
          if (data) cache.set(id, data);
          return data;
        })
        .finally(() => pending.delete(id)),
    );
  }
  return pending.get(id);
}

export function cachedImage(value) {
  if (!value) return null;
  if (!isMediaRef(value)) return value;
  return cache.get(value.slice(6)) || null;
}

const MAX_BYTES = 700 * 1024; // Firestore documents are limited to 1 MB

/** Opens the gallery, resizes the photo and stores it. Returns "media:<id>" or null if cancelled. */
export async function pickAndUploadImage() {
  // Android uses the system photo picker, which needs no storage permission.
  if (Platform.OS === 'ios') {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm && perm.granted === false && perm.canAskAgain === false) throw new Error('permission');
  }
  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: false,
    quality: 1,
  });
  if (res.canceled || !res.assets || !res.assets.length) return null;
  const asset = res.assets[0];

  let width = 1080;
  let compress = 0.6;
  let base64 = null;
  for (let i = 0; i < 4; i += 1) {
    const ctx = ImageManipulator.manipulate(asset.uri);
    if (!asset.width || asset.width > width) ctx.resize({ width });
    const ref = await ctx.renderAsync();
    const out = await ref.saveAsync({ base64: true, compress, format: SaveFormat.JPEG });
    base64 = out.base64;
    if (base64 && base64.length * 0.75 < MAX_BYTES) break;
    width = Math.round(width * 0.8);
    compress = Math.max(0.35, compress - 0.1);
  }
  if (!base64) throw new Error('process');

  const dataUri = `data:image/jpeg;base64,${base64}`;
  const added = await addDoc(collection(db, 'media'), { data: dataUri, createdAt: serverTimestamp() });
  cache.set(added.id, dataUri);
  return `media:${added.id}`;
}
