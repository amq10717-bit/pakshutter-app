import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useData } from '../context/DataContext';
import { Button, Card, Chip, Field, SectionHeader } from '../components/ui';
import { callPhone, openWhatsApp } from '../lib/contact';
import { colors, radius, space, type } from '../theme';

const SAVED_KEY = 'pakshutter.customer.v1';
const EMPTY = { name: '', phone: '', address: '', email: '', service: '', shutterType: '', width: '', height: '', quantity: '', message: '', contactBy: 'Call' };

export function normalizePhone(p) {
  return String(p || '').replace(/[\s\-()]/g, '');
}
export function isValidPkPhone(p) {
  const n = normalizePhone(p);
  return /^(\+92|0092|92|0)3\d{9}$/.test(n) || /^(\+92|0092|92|0)[1-9]\d{8,10}$/.test(n) || /^\+?\d{10,15}$/.test(n);
}

function withTimeout(promise, ms) {
  return Promise.race([promise, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);
}

export function buildWhatsAppText(f, businessName, ref) {
  const lines = [
    `*New Quotation Request${ref ? ` #${ref}` : ''}*`,
    `Name: ${f.name}`,
    `Phone: ${f.phone}`,
    `Address: ${f.address}`,
  ];
  if (f.email) lines.push(`Email: ${f.email}`);
  if (f.service) lines.push(`Service: ${f.service}`);
  if (f.shutterType) lines.push(`Shutter type: ${f.shutterType}`);
  if (f.width || f.height) lines.push(`Size: ${f.width || '?'} ft (W) x ${f.height || '?'} ft (H)`);
  if (f.quantity) lines.push(`Quantity: ${f.quantity}`);
  if (f.message) lines.push(`Details: ${f.message}`);
  lines.push(`Preferred contact: ${f.contactBy}`);
  lines.push('', `Sent from the ${businessName} app`);
  return lines.join('\n');
}

export default function QuoteScreen({ route }) {
  const { business, services, shutterTypes } = useData();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(null); // { ref, saved }
  const scrollRef = useRef(null);

  // Remember the customer's own details on this phone for next time
  useEffect(() => {
    AsyncStorage.getItem(SAVED_KEY)
      .then((raw) => {
        if (!raw) return;
        const s = JSON.parse(raw);
        setForm((f) => ({ ...f, name: f.name || s.name || '', phone: f.phone || s.phone || '', address: f.address || s.address || '', email: f.email || s.email || '' }));
      })
      .catch(() => {});
  }, []);

  // Pre-select service / shutter type when coming from a detail page
  const params = route.params || {};
  const [seenParams, setSeenParams] = useState(null);
  if (params._t && params._t !== seenParams) {
    setSeenParams(params._t);
    if (params.service || params.shutterType) {
      setDone(null);
      setForm((f) => ({ ...f, service: params.service || f.service, shutterType: params.shutterType || f.shutterType }));
    }
  }

  const set = (k) => (v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: null }));
  };

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = 'Please enter your name';
    if (!isValidPkPhone(form.phone)) e.phone = 'Please enter a valid phone number (e.g. 0300 1234567)';
    if (form.address.trim().length < 5) e.address = 'Please enter your address / area';
    if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = 'Please enter a valid email or leave it empty';
    if (!form.service) e.service = 'Please choose what you need';
    setErrors(e);
    if (Object.keys(e).length) scrollRef.current && scrollRef.current.scrollTo({ y: 0, animated: true });
    return !Object.keys(e).length;
  };

  const clean = () => ({
    name: form.name.trim().slice(0, 100),
    phone: normalizePhone(form.phone).slice(0, 20),
    address: form.address.trim().slice(0, 400),
    email: form.email.trim().slice(0, 120),
    service: form.service.slice(0, 120),
    shutterType: form.shutterType.slice(0, 120),
    width: form.width.trim().slice(0, 10),
    height: form.height.trim().slice(0, 10),
    quantity: form.quantity.trim().slice(0, 10),
    message: form.message.trim().slice(0, 1500),
    contactBy: form.contactBy,
  });

  const submit = async () => {
    if (!validate()) return;
    const data = clean();
    AsyncStorage.setItem(SAVED_KEY, JSON.stringify({ name: data.name, phone: form.phone, address: data.address, email: data.email })).catch(() => {});

    if (!db) {
      // No database connected: send the request through WhatsApp
      setDone({ ref: null, saved: false, data });
      openWhatsApp(business.whatsapp, buildWhatsAppText(data, business.name));
      return;
    }
    setSending(true);
    try {
      const ref = await withTimeout(
        addDoc(collection(db, 'inquiries'), { ...data, status: 'new', source: Platform.OS, createdAt: serverTimestamp() }),
        15000,
      );
      setDone({ ref: ref.id.slice(0, 6).toUpperCase(), saved: true, data });
    } catch (_e) {
      setDone({ ref: null, saved: false, data, failed: true });
    } finally {
      setSending(false);
    }
  };

  const reset = () => {
    setForm((f) => ({ ...EMPTY, name: f.name, phone: f.phone, address: f.address, email: f.email }));
    setDone(null);
  };

  if (done) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: space.xl }}>
        <Card style={{ alignItems: 'center', paddingVertical: 30 }}>
          <View style={[styles.okCircle, !done.saved && { backgroundColor: colors.warningTint }]}>
            <Ionicons name={done.saved ? 'checkmark' : 'logo-whatsapp'} size={44} color={done.saved ? colors.success : colors.warning} />
          </View>
          <Text style={[type.h2, { color: colors.navy, marginTop: 16, textAlign: 'center' }]}>
            {done.saved ? 'Request Received!' : done.failed ? 'Could not send online' : 'Send via WhatsApp'}
          </Text>
          <Text style={[type.body, { color: colors.textMuted, textAlign: 'center', marginTop: 8 }]}>
            {done.saved
              ? `Thank you ${done.data.name}. Our team will contact you shortly on ${done.data.phone}.`
              : done.failed
                ? 'Please check your internet connection, or send your request directly on WhatsApp.'
                : 'Your request is ready in WhatsApp — just press send.'}
          </Text>
          {done.ref ? (
            <View style={styles.refBox}>
              <Text style={styles.refLbl}>Reference No.</Text>
              <Text style={styles.refNum}>#{done.ref}</Text>
            </View>
          ) : null}
          <Button
            title={done.saved ? 'Also send on WhatsApp' : 'Send on WhatsApp'}
            icon="logo-whatsapp"
            variant="whatsapp"
            style={{ alignSelf: 'stretch', marginTop: 22 }}
            onPress={() => openWhatsApp(business.whatsapp, buildWhatsAppText(done.data, business.name, done.ref))}
          />
          <Button title="Call Now" icon="call" variant="outline" style={{ alignSelf: 'stretch', marginTop: 10 }} onPress={() => callPhone(business.phone)} />
          {done.failed ? (
            <Button title="Try Again" icon="refresh" variant="navy" style={{ alignSelf: 'stretch', marginTop: 10 }} onPress={() => setDone(null)} />
          ) : (
            <Button title="New Request" variant="outline" style={{ alignSelf: 'stretch', marginTop: 10 }} onPress={reset} />
          )}
        </Card>
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView ref={scrollRef} contentContainerStyle={{ padding: space.xl, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <SectionHeader overline="Free quotation" title="Request a Quote" subtitle="Tell us what you need. We'll call you back with a price — usually the same day." />

        <Card>
          <Text style={styles.group}>Your details</Text>
          <Field label="Full Name" required value={form.name} onChangeText={set('name')} placeholder="e.g. Muhammad Ali" error={errors.name} autoComplete="name" textContentType="name" maxLength={100} />
          <Field label="Phone Number" required value={form.phone} onChangeText={set('phone')} placeholder="03XX XXXXXXX" keyboardType="phone-pad" error={errors.phone} autoComplete="tel" textContentType="telephoneNumber" maxLength={20} />
          <Field label="Address / Area" required value={form.address} onChangeText={set('address')} placeholder="Shop / house no., street, area, city" error={errors.address} multiline inputStyle={{ minHeight: 80 }} maxLength={400} />
          <Field label="Email" value={form.email} onChangeText={set('email')} placeholder="Optional" keyboardType="email-address" autoCapitalize="none" error={errors.email} autoComplete="email" maxLength={120} style={{ marginBottom: 4 }} />
        </Card>

        <Card style={{ marginTop: 16 }}>
          <Text style={styles.group}>
            What do you need? <Text style={{ color: colors.danger }}>*</Text>
          </Text>
          <View style={styles.chips}>
            {services.map((s) => (
              <Chip key={s.id} label={s.title} selected={form.service === s.title} onPress={() => set('service')(s.title)} />
            ))}
          </View>
          {errors.service ? <Text style={styles.err}>{errors.service}</Text> : null}

          <Text style={[styles.group, { marginTop: 14 }]}>Shutter type</Text>
          <View style={styles.chips}>
            {shutterTypes.map((t) => (
              <Chip key={t.id} label={t.name} selected={form.shutterType === t.name} onPress={() => set('shutterType')(form.shutterType === t.name ? '' : t.name)} />
            ))}
            <Chip label="Not sure" selected={form.shutterType === 'Not sure'} onPress={() => set('shutterType')(form.shutterType === 'Not sure' ? '' : 'Not sure')} />
          </View>

          <Text style={[styles.group, { marginTop: 14 }]}>Approximate size (optional)</Text>
          <View style={{ flexDirection: 'row' }}>
            <Field label="Width (ft)" value={form.width} onChangeText={set('width')} keyboardType="decimal-pad" placeholder="10" style={{ flex: 1, marginRight: 8 }} maxLength={10} />
            <Field label="Height (ft)" value={form.height} onChangeText={set('height')} keyboardType="decimal-pad" placeholder="12" style={{ flex: 1, marginRight: 8 }} maxLength={10} />
            <Field label="Qty" value={form.quantity} onChangeText={set('quantity')} keyboardType="number-pad" placeholder="1" style={{ width: 70 }} maxLength={4} />
          </View>
          <Field label="Details / Message" value={form.message} onChangeText={set('message')} placeholder="Describe your requirement or problem…" multiline maxLength={1500} />

          <Text style={styles.group}>How should we contact you?</Text>
          <View style={styles.chips}>
            {[
              ['Call', 'call'],
              ['WhatsApp', 'logo-whatsapp'],
            ].map(([c, icon]) => (
              <Chip key={c} label={c} icon={icon} selected={form.contactBy === c} onPress={() => set('contactBy')(c)} />
            ))}
          </View>
        </Card>

        <Button title="Submit Request" icon="send" loading={sending} onPress={submit} style={{ marginTop: 20 }} />
        <Text style={styles.privacy}>
          Your details are only used by {business.name} to contact you about this request.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  group: { fontSize: 15, fontWeight: '800', color: colors.navy, marginBottom: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
  err: { color: colors.danger, fontSize: 12.5, fontWeight: '600', marginTop: -2 },
  privacy: { textAlign: 'center', color: colors.textLight, fontSize: 12.5, marginTop: 12 },
  okCircle: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.successTint, alignItems: 'center', justifyContent: 'center' },
  refBox: { marginTop: 18, backgroundColor: colors.blueTint, borderRadius: radius.md, paddingHorizontal: 22, paddingVertical: 10, alignItems: 'center' },
  refLbl: { color: colors.textMuted, fontSize: 12, fontWeight: '700' },
  refNum: { color: colors.navy, fontSize: 22, fontWeight: '900', letterSpacing: 1 },
});
