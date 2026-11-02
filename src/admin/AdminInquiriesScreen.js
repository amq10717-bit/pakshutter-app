import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Card, Chip, EmptyState, Loading } from '../components/ui';
import { withAdmin } from './AdminGate';
import { colors, radius, space, type } from '../theme';

export const STATUS = {
  new: { label: 'New', color: colors.blue, bg: colors.blueTint },
  contacted: { label: 'Contacted', color: colors.warning, bg: colors.warningTint },
  done: { label: 'Completed', color: colors.success, bg: colors.successTint },
  cancelled: { label: 'Cancelled', color: colors.textMuted, bg: '#EEF1F5' },
};

export function formatDate(ts) {
  if (!ts || !ts.toDate) return 'Just now';
  const d = ts.toDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let h = d.getHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}, ${h}:${String(d.getMinutes()).padStart(2, '0')} ${ampm}`;
}

export function StatusPill({ status }) {
  const s = STATUS[status] || STATUS.new;
  return (
    <View style={{ backgroundColor: s.bg, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 }}>
      <Text style={{ color: s.color, fontWeight: '800', fontSize: 12 }}>{s.label}</Text>
    </View>
  );
}

function AdminInquiriesScreen({ navigation }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    return onSnapshot(
      query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'), limit(300)),
      (snap) => {
        setItems(snap.docs.map((d) => ({ ...d.data(), id: d.id })));
        setError(false);
      },
      () => setError(true),
    );
  }, []);

  const counts = useMemo(() => {
    const c = { all: 0, new: 0, contacted: 0, done: 0, cancelled: 0 };
    (items || []).forEach((i) => {
      c.all += 1;
      c[i.status || 'new'] = (c[i.status || 'new'] || 0) + 1;
    });
    return c;
  }, [items]);

  if (error) return <EmptyState icon="warning-outline" title="Could not load requests" text="Check your internet connection and that you are logged in as admin." />;
  if (!items) return <Loading label="Loading requests…" />;

  const shown = filter === 'all' ? items : items.filter((i) => (i.status || 'new') === filter);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: space.xl, paddingTop: 14 }}>
          <Chip label={`All (${counts.all})`} selected={filter === 'all'} onPress={() => setFilter('all')} />
          {Object.keys(STATUS).map((k) => (
            <Chip key={k} label={`${STATUS[k].label} (${counts[k] || 0})`} selected={filter === k} onPress={() => setFilter(k)} />
          ))}
        </ScrollView>
      </View>
      <FlatList
        data={shown}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: space.xl, paddingTop: 8, paddingBottom: 40 }}
        ListEmptyComponent={<EmptyState icon="mail-open-outline" title="No requests here" text="New quote requests from customers will appear here." />}
        renderItem={({ item }) => (
          <Card style={[styles.card, (item.status || 'new') === 'new' && styles.cardNew]} onPress={() => navigation.navigate('AdminInquiry', { id: item.id })}>
            <View style={styles.top}>
              <Text style={[type.h3, { color: colors.navy, flex: 1 }]} numberOfLines={1}>
                {item.name}
              </Text>
              <StatusPill status={item.status} />
            </View>
            <Text style={styles.service} numberOfLines={1}>
              {item.service}
              {item.shutterType ? ` · ${item.shutterType}` : ''}
            </Text>
            <View style={styles.meta}>
              <Ionicons name="call-outline" size={14} color={colors.textMuted} />
              <Text style={styles.metaText}>{item.phone}</Text>
              <Ionicons name="time-outline" size={14} color={colors.textMuted} style={{ marginLeft: 12 }} />
              <Text style={styles.metaText}>{formatDate(item.createdAt)}</Text>
            </View>
            {item.address ? (
              <View style={styles.meta}>
                <Ionicons name="location-outline" size={14} color={colors.textMuted} />
                <Text style={[styles.metaText, { flex: 1 }]} numberOfLines={1}>
                  {item.address}
                </Text>
              </View>
            ) : null}
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12, padding: 14 },
  cardNew: { borderLeftWidth: 4, borderLeftColor: colors.blue },
  top: { flexDirection: 'row', alignItems: 'center' },
  service: { color: colors.blue, fontWeight: '700', marginTop: 4 },
  meta: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  metaText: { marginLeft: 5, color: colors.textMuted, fontSize: 13 },
});

export default withAdmin(AdminInquiriesScreen);
