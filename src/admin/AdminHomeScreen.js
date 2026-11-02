import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Button, Card, IconBadge } from '../components/ui';
import { SCHEMAS } from './schemas';
import { friendlyError, seedAll } from './adminApi';
import { withAdmin } from './AdminGate';
import { colors, radius, space, type } from '../theme';

function AdminHomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { live, services, shutterTypes, gallery, testimonials } = useData();
  const [newCount, setNewCount] = useState(null);
  const [seeding, setSeeding] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          hitSlop={10}
          onPress={() =>
            Alert.alert('Log out', 'Do you want to log out of the admin panel?', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Log out',
                style: 'destructive',
                onPress: () => {
                  navigation.popToTop();
                  logout().catch(() => {});
                },
              },
            ])
          }
        >
          <Ionicons name="log-out-outline" size={24} color={colors.white} />
        </Pressable>
      ),
    });
  }, [navigation, logout]);

  useEffect(() => {
    return onSnapshot(
      query(collection(db, 'inquiries'), where('status', '==', 'new')),
      (snap) => setNewCount(snap.size),
      () => setNewCount(0),
    );
  }, []);

  const notSeeded = ['business', 'services', 'shutterTypes', 'gallery', 'testimonials'].filter((k) => !live[k]);

  const seed = async () => {
    setSeeding(true);
    try {
      await seedAll();
      Alert.alert('Done', 'Website content has been copied into your database. You can now edit everything.');
    } catch (e) {
      Alert.alert('Could not copy content', friendlyError(e));
    } finally {
      setSeeding(false);
    }
  };

  const tiles = [
    { kind: 'business', count: null },
    { kind: 'services', count: services.length },
    { kind: 'shutterTypes', count: shutterTypes.length },
    { kind: 'gallery', count: gallery.length },
    { kind: 'testimonials', count: testimonials.length },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: space.xl, paddingBottom: 40 }}>
      <Text style={[type.small, { color: colors.textMuted }]}>Logged in as</Text>
      <Text style={[type.h3, { color: colors.navy }]}>{user && user.email}</Text>

      <Pressable onPress={() => navigation.navigate('AdminInquiries')} style={({ pressed }) => [styles.inqCard, pressed && { opacity: 0.9 }]}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: 'rgba(255,255,255,0.75)', fontWeight: '700' }}>Quote Requests</Text>
          <Text style={{ color: colors.white, fontSize: 32, fontWeight: '900', marginTop: 4 }}>{newCount === null ? '…' : newCount}</Text>
          <Text style={{ color: 'rgba(255,255,255,0.75)' }}>new {newCount === 1 ? 'request' : 'requests'}</Text>
        </View>
        <View style={styles.inqIcon}>
          <Ionicons name="mail-unread" size={28} color={colors.navy} />
        </View>
      </Pressable>

      {notSeeded.length ? (
        <Card style={{ marginTop: 16, borderColor: colors.warning, backgroundColor: colors.warningTint }}>
          <Text style={[type.h3, { color: colors.navy }]}>First-time setup</Text>
          <Text style={[type.body, { color: colors.text, marginTop: 4 }]}>
            The app is showing the built-in website content. Copy it into your database once so you can edit it here.
          </Text>
          <Button title="Load website content" icon="cloud-upload" variant="navy" loading={seeding} style={{ marginTop: 12 }} onPress={seed} />
        </Card>
      ) : null}

      <Text style={[type.overline, { color: colors.blue, marginTop: 24, marginBottom: 12 }]}>Manage content</Text>
      {tiles.map(({ kind, count }) => {
        const s = SCHEMAS[kind];
        return (
          <Card
            key={kind}
            style={styles.tile}
            onPress={() => (kind === 'business' ? navigation.navigate('AdminEdit', { kind: 'business' }) : navigation.navigate('AdminList', { kind }))}
          >
            <IconBadge name={s.icon} />
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={[type.h3, { color: colors.navy }]}>{s.label}</Text>
              <Text style={[type.small, { color: colors.textMuted }]}>
                {count === null ? 'Phone, WhatsApp, address, home & about text' : `${count} ${count === 1 ? 'item' : 'items'}`}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
          </Card>
        );
      })}

      <Text style={[type.small, { color: colors.textLight, textAlign: 'center', marginTop: 16 }]}>
        {"Changes appear in everyone's app instantly."}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  inqCard: { marginTop: 16, backgroundColor: colors.navy, borderRadius: radius.xl, padding: 20, flexDirection: 'row', alignItems: 'center' },
  inqIcon: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  tile: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, padding: 14 },
});

export default withAdmin(AdminHomeScreen);
