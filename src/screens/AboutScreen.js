import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useData } from '../context/DataContext';
import SmartImage from '../components/SmartImage';
import { Bullet, Button, Card, SectionHeader } from '../components/ui';
import { goToQuote } from '../navigation/helpers';
import { colors, radius, space, type } from '../theme';

export default function AboutScreen({ navigation }) {
  const { business } = useData();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
      <SmartImage source={business.aboutImage || business.heroImage} style={{ height: 220 }} />
      <View style={{ padding: space.xl }}>
        <SectionHeader overline="Who we are" title={business.aboutTitle} />
        <Text style={[type.body, { color: colors.text, fontSize: 16, lineHeight: 25 }]}>{business.aboutText}</Text>

        <LinearGradient colors={[colors.navy, colors.blue]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.stats}>
          {(business.stats || []).map((s, i) => (
            <View key={i} style={styles.stat}>
              <Text style={styles.num}>{s.title}</Text>
              <Text style={styles.lbl}>{s.desc}</Text>
            </View>
          ))}
        </LinearGradient>

        {(business.highlights || []).length ? (
          <Card>
            <SectionHeader title="Why choose us" style={{ marginBottom: 12 }} />
            {business.highlights.map((h) => (
              <Bullet key={h} text={h} icon="shield-checkmark" />
            ))}
          </Card>
        ) : null}

        <Button title="Get A Quote" icon="document-text" style={{ marginTop: 20 }} onPress={() => goToQuote(navigation)} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  stats: { borderRadius: radius.xl, padding: 14, flexDirection: 'row', flexWrap: 'wrap', marginVertical: 22 },
  stat: { width: '50%', alignItems: 'center', paddingVertical: 12 },
  num: { color: colors.white, fontSize: 28, fontWeight: '900' },
  lbl: { color: 'rgba(255,255,255,0.75)', fontSize: 11.5, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', textAlign: 'center' },
});
