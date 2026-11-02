import React, { useLayoutEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useData } from '../context/DataContext';
import SmartImage from '../components/SmartImage';
import { Bullet, Card, EmptyState, IconBadge, SectionHeader } from '../components/ui';
import { ContactBar } from '../components/brand';
import { goToQuote } from '../navigation/helpers';
import { ionOr } from '../lib/icons';
import { colors, radius, space, type } from '../theme';

export default function ServiceDetailScreen({ route, navigation }) {
  const { services, business } = useData();
  const service = services.find((s) => s.id === (route.params && route.params.id));

  useLayoutEffect(() => {
    if (service) navigation.setOptions({ title: service.title });
  }, [navigation, service]);

  if (!service) {
    return <EmptyState icon="alert-circle-outline" title="Service not found" text="This service may have been removed." />;
  }

  const steps = Array.isArray(service.steps) ? service.steps : [];
  const checklist = Array.isArray(service.checklist) ? service.checklist : [];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <SmartImage source={service.image} style={{ height: 250 }} icon={ionOr(service.icon)}>
          <LinearGradient colors={['transparent', 'rgba(10,31,54,0.95)']} style={StyleSheet.absoluteFill} />
          <View style={styles.heroText}>
            <IconBadge name={ionOr(service.icon)} bg={colors.white} color={colors.blue} box={42} size={20} />
            <Text style={[type.h1, { color: colors.white, marginTop: 12, fontSize: 25 }]}>{service.headline || service.title}</Text>
          </View>
        </SmartImage>

        <View style={{ padding: space.xl }}>
          <Text style={[type.body, { color: colors.text, fontSize: 16, lineHeight: 24 }]}>{service.description || service.short}</Text>

          {steps.length ? (
            <View style={{ marginTop: 26 }}>
              <SectionHeader title={service.stepsTitle || 'Details'} />
              {steps.map((st, i) => (
                <Card key={i} style={styles.step}>
                  <View style={styles.num}>
                    <Text style={styles.numText}>{String(i + 1).padStart(2, '0')}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[type.h3, { color: colors.navy }]}>{st.title}</Text>
                    {st.desc ? <Text style={[type.body, { color: colors.textMuted, marginTop: 4 }]}>{st.desc}</Text> : null}
                  </View>
                </Card>
              ))}
            </View>
          ) : null}

          {checklist.length ? (
            <Card style={{ marginTop: 16 }}>
              <SectionHeader title={service.checklistTitle || 'Included'} style={{ marginBottom: 12 }} />
              {checklist.map((c, i) => (
                <Bullet key={i} text={c} />
              ))}
            </Card>
          ) : null}

          {service.note ? (
            <LinearGradient colors={[colors.navy, colors.blue]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.note}>
              <Text style={{ color: colors.white, fontSize: 16, fontWeight: '700', lineHeight: 23 }}>{service.note}</Text>
            </LinearGradient>
          ) : null}
        </View>
      </ScrollView>
      <ContactBar
        quoteLabel={service.cta || 'Get A Quote'}
        message={`Assalam o Alaikum ${business.name}, I need information about: ${service.title}`}
        onQuote={() => goToQuote(navigation, { service: service.title })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  heroText: { position: 'absolute', left: space.xl, right: space.xl, bottom: 20 },
  step: { flexDirection: 'row', marginBottom: 12, padding: 14 },
  num: { width: 42, height: 42, borderRadius: radius.md, backgroundColor: colors.blueTint, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  numText: { color: colors.blue, fontWeight: '900', fontSize: 15 },
  note: { borderRadius: radius.lg, padding: 18, marginTop: 18 },
});
