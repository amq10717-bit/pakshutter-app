import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  DEFAULT_BUSINESS,
  DEFAULT_SERVICES,
  DEFAULT_SHUTTER_TYPES,
  DEFAULT_GALLERY,
  DEFAULT_TESTIMONIALS,
} from '../data/defaults';

const CACHE_KEY = 'pakshutter.content.v1';

const DataContext = createContext(null);

const byOrder = (a, b) => (Number(a.order) || 0) - (Number(b.order) || 0);

const initial = {
  business: DEFAULT_BUSINESS,
  services: DEFAULT_SERVICES,
  shutterTypes: DEFAULT_SHUTTER_TYPES,
  gallery: DEFAULT_GALLERY,
  testimonials: DEFAULT_TESTIMONIALS,
};

export function DataProvider({ children }) {
  const [content, setContent] = useState(initial);
  const [live, setLive] = useState({}); // which parts came from the database
  const [loading, setLoading] = useState(!!db);

  // Show the last content we saw straight away (works offline too).
  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(CACHE_KEY)
      .then((raw) => {
        if (!raw || cancelled) return;
        const cached = JSON.parse(raw);
        setContent((c) => ({ ...c, ...cached, business: { ...DEFAULT_BUSINESS, ...(cached.business || {}) } }));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!db) return undefined;
    const unsubs = [];
    const done = new Set();
    const markDone = (k) => {
      done.add(k);
      if (done.size >= 5) setLoading(false);
    };
    const timer = setTimeout(() => setLoading(false), 8000);

    const listen = (key, name, defaults) => {
      unsubs.push(
        onSnapshot(
          collection(db, name),
          (snap) => {
            const items = snap.docs.map((d) => ({ ...d.data(), id: d.id })).sort(byOrder);
            const hasData = items.length > 0;
            setContent((c) => ({ ...c, [key]: hasData ? items : defaults }));
            setLive((l) => ({ ...l, [key]: hasData }));
            markDone(key);
          },
          () => markDone(key),
        ),
      );
    };

    unsubs.push(
      onSnapshot(
        doc(db, 'settings', 'business'),
        (snap) => {
          const data = snap.exists() ? snap.data() : null;
          setContent((c) => ({ ...c, business: { ...DEFAULT_BUSINESS, ...(data || {}) } }));
          setLive((l) => ({ ...l, business: !!data }));
          markDone('business');
        },
        () => markDone('business'),
      ),
    );
    listen('services', 'services', DEFAULT_SERVICES);
    listen('shutterTypes', 'shutterTypes', DEFAULT_SHUTTER_TYPES);
    listen('gallery', 'gallery', DEFAULT_GALLERY);
    listen('testimonials', 'testimonials', DEFAULT_TESTIMONIALS);

    return () => {
      clearTimeout(timer);
      unsubs.forEach((u) => u && u());
    };
  }, []);

  // Save for next launch
  useEffect(() => {
    AsyncStorage.setItem(CACHE_KEY, JSON.stringify(content)).catch(() => {});
  }, [content]);

  const value = useMemo(() => ({ ...content, live, loading }), [content, live, loading]);
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside DataProvider');
  return ctx;
}
