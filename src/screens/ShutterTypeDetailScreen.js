import React, { useLayoutEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../context/DataContext';
import SmartImage from '../components/SmartImage';
import { Bullet, Card, EmptyState, SectionHeader } from '../components/ui';
import { ContactBar } from '../components/brand';
import { goToQuote } from '../navigation/helpers';
import { colors, radius, space, type } from '../theme';

export default function ShutterTypeDetailScreen({ route, navigation }) {
  const { shutterTypes, business } = useData();
  const item = shutterTypes.find((t) => t.id === (route.params && route.params.id));

  useLayoutEffect(() => {
    if (item) navigation.setOptions({ title: item.name });
  }, [navigation, item]);

  if (!item) return <EmptyState icon="alert-circle-outline" title="Not found" text="This shutter type may have been removed." />;
  const features = Array.isArray(item.features) ? item.features : [];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <SmartImage source={item.image} style={{ height: 260 }} />
        <View style={styles.body}>
          <Text style={[type.h1, { color: colors.navy, fontSize: 25 }]}>{item.name}</Text>
          {item.bestFor ? (
            <View style={styles.best}>
              <Ionicons name="location" size={15} color={colors.blue} />
              <Text style={styles.bestText}>Best for: {item.bestFor}</Text>
            </View>
          ) : null}
          <Text style={[type.body, { color: colors.text, fontSize: 16, lineHeight: 24, marginTop: 14 }]}>{item.description || item.short}</Text>

          {features.length ? (
            <Card style={{ marginTop: 20 }}>
              <SectionHeader title="Key Features" style={{ marginBottom: 12 }} />
              {features.map((f, i) => (
                <Bullet key={i} text={f} />
              ))}
            </Card>
          ) : null}

          <Card style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="resize" size={26} color={colors.blue} />
            <Text style={[type.body, { flex: 1, marginLeft: 12, color: colors.textMuted }]}>
              {"Every shutter is made to your exact size. Request a quote and we'll visit to take measurements."}
            </Text>
          </Card>
        </View>
      </ScrollView>
      <ContactBar
        message={`Assalam o Alaikum ${business.name}, I want a quotation for: ${item.name}`}
        onQuote={() => goToQuote(navigation, { shutterType: item.name, service: 'New Shutter Installation' })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  body: { padding: space.xl, marginTop: -24, backgroundColor: colors.bg, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl },
  best: { flexDirection: 'row', alignItems: 'center', marginTop: 10, backgroundColor: colors.blueTint, alignSelf: 'flex-start', borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6 },
  bestText: { marginLeft: 6, color: colors.navy, fontWeight: '700', fontSize: 13 },
});
