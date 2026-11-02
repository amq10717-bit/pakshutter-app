import React, { useMemo, useRef, useState } from 'react';
import { FlatList, Modal, Pressable, ScrollView, StatusBar, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useData } from '../context/DataContext';
import SmartImage from '../components/SmartImage';
import { Chip, EmptyState } from '../components/ui';
import { colors, radius, space } from '../theme';

export default function GalleryScreen({ route }) {
  const { gallery } = useData();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [cat, setCat] = useState('All');
  const [viewer, setViewer] = useState(() => {
    const start = route.params && route.params.start;
    return typeof start === 'number' && gallery[start] ? start : null;
  });
  const listRef = useRef(null);

  const cats = useMemo(() => ['All', ...Array.from(new Set(gallery.map((g) => g.category).filter(Boolean)))], [gallery]);
  const items = cat === 'All' ? gallery : gallery.filter((g) => g.category === cat);
  const size = (width - space.xl * 2 - 12) / 2;

  if (!gallery.length) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <EmptyState icon="images-outline" title="No photos yet" text="Project photos will appear here soon." />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {cats.length > 2 ? (
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: space.xl, paddingTop: 14 }}>
            {cats.map((c) => (
              <Chip key={c} label={c} selected={cat === c} onPress={() => setCat(c)} />
            ))}
          </ScrollView>
        </View>
      ) : null}
      <FlatList
        data={items}
        key="grid"
        numColumns={2}
        keyExtractor={(g) => g.id}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ padding: space.xl, paddingTop: 14 }}
        renderItem={({ item }) => (
          <Pressable
            style={{ width: size, marginBottom: 12 }}
            onPress={() => setViewer(items.indexOf(item) >= 0 ? gallery.indexOf(item) : 0)}
            accessibilityLabel={item.caption || 'Photo'}
          >
            <SmartImage source={item.image} style={{ width: size, height: size * 1.1, borderRadius: radius.md }} iconSize={24} />
            {item.caption ? (
              <Text numberOfLines={2} style={styles.caption}>
                {item.caption}
              </Text>
            ) : null}
          </Pressable>
        )}
      />

      <Modal visible={viewer !== null} transparent={false} animationType="fade" onRequestClose={() => setViewer(null)} statusBarTranslucent>
        <StatusBar barStyle="light-content" />
        <View style={{ flex: 1, backgroundColor: '#000' }}>
          {viewer !== null ? (
            <FlatList
              ref={listRef}
              data={gallery}
              horizontal
              pagingEnabled
              initialScrollIndex={viewer}
              getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
              keyExtractor={(g) => g.id}
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => setViewer(Math.round(e.nativeEvent.contentOffset.x / width))}
              renderItem={({ item }) => (
                <View style={{ width, height, justifyContent: 'center' }}>
                  <SmartImage source={item.image} style={{ width, height: height * 0.72, backgroundColor: '#000' }} contentFit="contain" />
                </View>
              )}
            />
          ) : null}
          <Pressable style={[styles.close, { top: insets.top + 10 }]} onPress={() => setViewer(null)} accessibilityLabel="Close" hitSlop={12}>
            <Ionicons name="close" size={26} color={colors.white} />
          </Pressable>
          {viewer !== null && gallery[viewer] ? (
            <View style={[styles.viewerFoot, { paddingBottom: insets.bottom + 18 }]}>
              <Text style={styles.viewerCaption}>{gallery[viewer].caption}</Text>
              <Text style={styles.viewerCount}>
                {viewer + 1} / {gallery.length}
              </Text>
            </View>
          ) : null}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  caption: { marginTop: 6, color: colors.navy, fontWeight: '600', fontSize: 13 },
  close: { position: 'absolute', right: 16, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' },
  viewerFoot: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 20 },
  viewerCaption: { color: colors.white, fontSize: 16, fontWeight: '700' },
  viewerCount: { color: 'rgba(255,255,255,0.6)', marginTop: 4 },
});
