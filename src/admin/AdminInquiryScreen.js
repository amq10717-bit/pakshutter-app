import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { deleteDoc, doc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useData } from '../context/DataContext';
import { Button, Card, Chip, EmptyState, Field, Loading } from '../components/ui';
import { callPhone, openMap, openWhatsApp, sendEmail } from '../lib/contact';
import { friendlyError } from './adminApi';
import { withAdmin } from './AdminGate';
import { STATUS, StatusPill, formatDate } from './AdminInquiriesScreen';
import { colors, space, type } from '../theme';

function Row({ label, value }) {
  if (!value) return null;
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue} selectable>
        {value}
      </Text>
    </View>
  );
}

function AdminInquiryScreen({ route, navigation }) {
  const { id } = route.params;
  const { business } = useData();
  const [item, setItem] = useState(undefined);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    return onSnapshot(
      doc(db, 'inquiries', id),
      (snap) => {
        const d = snap.exists() ? { ...snap.data(), id: snap.id } : null;
        setItem(d);
        if (d && typeof d.adminNote === 'string') setNote((n) => (n === '' ? d.adminNote : n));
      },
      () => setItem(null),
    );
  }, [id]);

  if (item === undefined) return <Loading />;
  if (item === null) return <EmptyState icon="trash-outline" title="Request not found" text="It may have been deleted." />;

  const update = async (data) => {
    setBusy(true);
    try {
      await updateDoc(doc(db, 'inquiries', id), { ...data, updatedAt: serverTimestamp() });
    } catch (e) {
      Alert.alert('Could not update', friendlyError(e));
    } finally {
      setBusy(false);
    }
  };

  const remove = () =>
    Alert.alert('Delete request?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            navigation.goBack();
            await deleteDoc(doc(db, 'inquiries', id));
          } catch (e) {
            Alert.alert('Could not delete', friendlyError(e));
          }
        },
      },
    ]);

  const size = item.width || item.height ? `${item.width || '?'} ft × ${item.height || '?'} ft` : '';
  const ref = id.slice(0, 6).toUpperCase();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: space.xl, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={[type.small, { color: colors.textMuted }]}>
          #{ref} · {formatDate(item.createdAt)}
        </Text>
        <StatusPill status={item.status} />
      </View>
      <Text style={[type.h2, { color: colors.navy, marginTop: 6 }]}>{item.name}</Text>
      <Text style={{ color: colors.blue, fontWeight: '700', marginTop: 2 }}>{item.service}</Text>

      <View style={{ flexDirection: 'row', marginTop: 16 }}>
        <Button title="Call" icon="call" variant="navy" style={{ flex: 1, marginRight: 8 }} onPress={() => callPhone(item.phone)} />
        <Button
          title="WhatsApp"
          icon="logo-whatsapp"
          variant="whatsapp"
          style={{ flex: 1 }}
          onPress={() => openWhatsApp(item.phone, `Assalam o Alaikum ${item.name}, this is ${business.name} regarding your quotation request #${ref}.`)}
        />
      </View>

      <Card style={{ marginTop: 16 }}>
        <Row label="Phone" value={item.phone} />
        <Row label="Address" value={item.address} />
        <Row label="Email" value={item.email} />
        <Row label="Service" value={item.service} />
        <Row label="Shutter type" value={item.shutterType} />
        <Row label="Size" value={size} />
        <Row label="Quantity" value={item.quantity} />
        <Row label="Prefers" value={item.contactBy} />
        <Row label="Details" value={item.message} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 }}>
          {item.address ? <Button small title="Open in Maps" icon="map" variant="outline" style={{ marginRight: 8, marginTop: 8 }} onPress={() => openMap(item.address)} /> : null}
          {item.email ? <Button small title="Email" icon="mail" variant="outline" style={{ marginTop: 8 }} onPress={() => sendEmail(item.email, `Your quotation - ${business.name}`)} /> : null}
        </View>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Text style={styles.h}>Status</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {Object.keys(STATUS).map((k) => (
            <Chip key={k} label={STATUS[k].label} selected={(item.status || 'new') === k} onPress={() => !busy && update({ status: k })} />
          ))}
        </View>
        <Field label="Private note" value={note} onChangeText={setNote} multiline placeholder="e.g. Quoted Rs. 85,000 — site visit Friday" style={{ marginTop: 10, marginBottom: 10 }} maxLength={1000} />
        <Button small title="Save note" icon="save" variant="navy" loading={busy} onPress={() => update({ adminNote: note.trim() })} style={{ alignSelf: 'flex-start' }} />
      </Card>

      <Button title="Delete Request" icon="trash" variant="danger" style={{ marginTop: 20 }} onPress={remove} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowLabel: { fontSize: 12.5, fontWeight: '700', color: colors.textMuted },
  rowValue: { fontSize: 15.5, color: colors.text, marginTop: 2 },
  h: { fontSize: 15, fontWeight: '800', color: colors.navy, marginBottom: 10 },
});

export default withAdmin(AdminInquiryScreen);
