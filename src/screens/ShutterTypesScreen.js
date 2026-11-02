import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../context/DataContext';
import SmartImage from '../components/SmartImage';
import { Card, SectionHeader } from '../components/ui';
import { WhatsAppFab } from '../components/brand';
import { colors, radius, space, type } from '../theme';

export default function ShutterTypesScreen({ navigation }) {
  const { shutterTypes, gallery } = useData();
  const { width } = useWindowDimensions();
  const thumb = (width - space.xl * 2 - 20 - 16) / 3;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <FlatList
        data={shutterTypes}
        keyExtractor={(t) => t.id}
        contentContainerStyle={{ padding: space.xl, paddingBottom: 110 }}
        ListHeaderComponent={
          <View>
            <Pressable style={styles.galleryBanner} onPress={() => navigation.navigate('Gallery')}>
              <View style={{ flexDirection: 'row' }}>
                {gallery.slice(0, 3).map((g, i) => (
                  <SmartImage key={g.id} source={g.image} style={[styles.gThumb, { width: thumb, marginLeft: i ? 8 : 0 }]} iconSize={20} />
                ))}
              </View>
              <View style={styles.galleryFoot}>
                <Ionicons name="images" size={18} color={colors.blue} />
                <Text style={styles.galleryText}>View photo gallery ({gallery.length})</Text>
                <Ionicons name="arrow-forward" size={16} color={colors.blue} />
              </View>
            </Pressable>
            <SectionHeader
              overline="Shutter types"
              title="Choose the right shutter"
              subtitle="Tap a type to see its features and where it works best."
              style={{ marginTop: 24 }}
            />
          </View>
        }
        renderItem={({ item }) => (
          <Card style={styles.card} onPress={() => navigation.navigate('ShutterTypeDetail', { id: item.id })}>
            <SmartImage source={item.image} style={styles.img} />
            <View style={{ padding: 16 }}>
              <Text style={[type.h3, { color: colors.navy, fontSize: 17.5 }]}>{item.name}</Text>
              <Text style={[type.body, { color: colors.textMuted, marginTop: 5 }]}>{item.short}</Text>
              {item.bestFor ? (
                <View style={styles.best}>
                  <Ionicons name="location-outline" size={14} color={colors.blue} />
                  <Text style={styles.bestText} numberOfLines={1}>Best for: {item.bestFor}</Text>
                </View>
              ) : null}
            </View>
          </Card>
        )}
      />
      <WhatsAppFab />
    </View>
  );
}

const styles = StyleSheet.create({
  galleryBanner: { backgroundColor: colors.white, borderRadius: radius.lg, padding: 10, borderWidth: 1, borderColor: colors.border },
  gThumb: { height: 86, borderRadius: radius.md },
  galleryFoot: { flexDirection: 'row', alignItems: 'center', paddingTop: 10, paddingHorizontal: 4 },
  galleryText: { flex: 1, marginLeft: 8, color: colors.navy, fontWeight: '800' },
  card: { padding: 0, marginBottom: 16 },
  img: { height: 160, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg },
  best: { flexDirection: 'row', alignItems: 'center', marginTop: 10, backgroundColor: colors.blueTint, alignSelf: 'flex-start', borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 5, maxWidth: '100%' },
  bestText: { marginLeft: 5, color: colors.navy, fontWeight: '700', fontSize: 12.5, flexShrink: 1 },
});
