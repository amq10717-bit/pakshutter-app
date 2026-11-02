import React, { useLayoutEffect } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useData } from '../context/DataContext';
import SmartImage from '../components/SmartImage';
import { Card, EmptyState } from '../components/ui';
import { SCHEMAS } from './schemas';
import { withAdmin } from './AdminGate';
import { colors, radius, space, type } from '../theme';

function AdminListScreen({ route, navigation }) {
  const { kind } = route.params;
  const schema = SCHEMAS[kind];
  const data = useData();
  const items = data[kind] || [];
  const insets = useSafeAreaInsets();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: schema.label,
      headerRight: () => (
        <Pressable hitSlop={10} onPress={() => navigation.navigate('AdminEdit', { kind })} accessibilityLabel={`Add ${schema.singular}`}>
          <Ionicons name="add-circle" size={28} color={colors.white} />
        </Pressable>
      ),
    });
  }, [navigation, schema, kind]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: space.xl, paddingBottom: 100 }}
        ListEmptyComponent={<EmptyState title={`No ${schema.label.toLowerCase()} yet`} text="Tap + to add the first one." />}
        renderItem={({ item }) => (
          <Card style={styles.row} onPress={() => navigation.navigate('AdminEdit', { kind, id: item.id })}>
            {schema.imageKey ? (
              <SmartImage source={item[schema.imageKey]} style={styles.thumb} iconSize={20} />
            ) : (
              <View style={[styles.thumb, styles.initial]}>
                <Text style={{ color: colors.white, fontWeight: '900', fontSize: 20 }}>{String(item[schema.titleKey] || '?').charAt(0)}</Text>
              </View>
            )}
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[type.h3, { color: colors.navy, fontSize: 15.5 }]} numberOfLines={1}>
                {item[schema.titleKey] || '(no title)'}
              </Text>
              {item[schema.subtitleKey] ? (
                <Text style={[type.small, { color: colors.textMuted }]} numberOfLines={2}>
                  {item[schema.subtitleKey]}
                </Text>
              ) : null}
            </View>
            <Ionicons name="create-outline" size={20} color={colors.blue} />
          </Card>
        )}
      />
      <Pressable style={[styles.fab, { bottom: 24 + insets.bottom }]} onPress={() => navigation.navigate('AdminEdit', { kind })}>
        <Ionicons name="add" size={22} color={colors.white} />
        <Text style={{ color: colors.white, fontWeight: '800', marginLeft: 6 }}>Add {schema.singular}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 10 },
  thumb: { width: 58, height: 58, borderRadius: radius.md },
  initial: { backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' },
  fab: { position: 'absolute', bottom: 24, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: colors.blue, paddingHorizontal: 22, paddingVertical: 14, borderRadius: radius.pill, elevation: 6, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
});

export default withAdmin(AdminListScreen);
