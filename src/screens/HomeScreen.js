import React from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useData } from '../context/DataContext';
import SmartImage from '../components/SmartImage';
import { Button, Card, IconBadge, SectionHeader } from '../components/ui';
import { Logo, WhatsAppFab } from '../components/brand';
import { callPhone, openMap, openWhatsApp } from '../lib/contact';
import { goToQuote, goToTab } from '../navigation/helpers';
import { colors, radius, space, type } from '../theme';
import { ionOr } from '../lib/icons';

export default function HomeScreen({ navigation }) {
  const { business, services, shutterTypes, gallery, testimonials } = useData();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const cardW = Math.min(300, width * 0.74);

  const quick = [
    { icon: 'call', label: 'Call', onPress: () => callPhone(business.phone), color: colors.blue },
    { icon: 'logo-whatsapp', label: 'WhatsApp', onPress: () => openWhatsApp(business.whatsapp, `Assalam o Alaikum ${business.name}, I need information about shutters.`), color: colors.whatsapp },
    { icon: 'document-text', label: 'Get Quote', onPress: () => goToQuote(navigation), color: colors.navy },
    { icon: 'location', label: 'Location', onPress: () => openMap(business.mapQuery || business.address), color: colors.warning },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Hero */}
        <SmartImage source={business.heroImage} style={{ minHeight: 470 + insets.top }} icon={null}>
          <LinearGradient
            colors={['rgba(10,31,54,0.88)', 'rgba(15,44,76,0.72)', 'rgba(10,31,54,0.96)']}
            style={[StyleSheet.absoluteFill]}
          />
          <View style={{ paddingTop: insets.top + 12, paddingHorizontal: space.xl, paddingBottom: 50 }}>
            <View style={styles.topRow}>
              <Logo size={42} onLongPress={() => navigation.navigate('AdminLogin')} />
              <Pressable style={styles.callPill} onPress={() => callPhone(business.phone)} accessibilityLabel="Call now">
                <Ionicons name="call" size={15} color={colors.navy} />
                <Text style={styles.callPillText}>Call Now</Text>
              </Pressable>
            </View>

            <View style={styles.badge}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeText}>{business.heroBadge}</Text>
            </View>
            <Text style={styles.heroTitle}>{business.heroTitle}</Text>
            <Text style={styles.heroText}>{business.heroText}</Text>

            <View style={{ flexDirection: 'row', marginTop: 24 }}>
              <Button title="Get A Quote" icon="arrow-forward" variant="white" onPress={() => goToQuote(navigation)} style={{ flex: 1, marginRight: 10 }} />
              <Button title="Our Services" variant="outlineLight" onPress={() => goToTab(navigation, 'Services')} style={{ flex: 1 }} />
            </View>

            <View style={styles.yearsBox}>
              <Text style={styles.yearsNum}>{(business.stats && business.stats[3] && business.stats[3].title) || '15+'} Years</Text>
              <Text style={styles.yearsLbl}>Of Excellence in Karachi</Text>
            </View>
          </View>
        </SmartImage>

        {/* Quick actions */}
        <View style={styles.quickWrap}>
          {quick.map((q) => (
            <Pressable key={q.label} style={styles.quickItem} onPress={q.onPress} accessibilityRole="button" accessibilityLabel={q.label}>
              <View style={[styles.quickIcon, { backgroundColor: q.color }]}>
                <Ionicons name={q.icon} size={22} color={colors.white} />
              </View>
              <Text style={styles.quickLabel}>{q.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Services */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <SectionHeader overline="What we offer" title="Premium Shutter & Metal Works" style={{ flex: 1, marginBottom: 0 }} />
          </View>
          <Text style={[type.body, { color: colors.textMuted, marginTop: 8, marginBottom: 16 }]}>
            {"Whether it's a new installation or an emergency repair, our expert team is equipped to handle all your industrial needs."}
          </Text>
        </View>
        <FlatList
          data={services}
          horizontal
          keyExtractor={(s) => s.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: space.xl, paddingBottom: 8 }}
          ItemSeparatorComponent={() => <View style={{ width: 14 }} />}
          renderItem={({ item }) => (
            <Card style={{ width: cardW, padding: 0 }} onPress={() => navigation.navigate('ServiceDetail', { id: item.id })}>
              <SmartImage source={item.image} style={{ height: 140, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg }} icon={ionOr(item.icon)} />
              <View style={{ padding: 16 }}>
                <Text style={[type.h3, { color: colors.navy }]} numberOfLines={1}>{item.title}</Text>
                <Text style={[type.small, { color: colors.textMuted, marginTop: 6 }]} numberOfLines={3}>{item.short}</Text>
                <View style={styles.more}>
                  <Text style={styles.moreText}>Discover More</Text>
                  <Ionicons name="arrow-forward" size={15} color={colors.blue} />
                </View>
              </View>
            </Card>
          )}
        />

        {/* Stats */}
        <View style={[styles.section, { marginTop: 28 }]}>
          <LinearGradient colors={[colors.navy, colors.blue]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.statsBox}>
            {(business.stats || []).slice(0, 4).map((s, i) => (
              <View key={i} style={styles.stat}>
                <Text style={styles.statNum}>{s.title}</Text>
                <Text style={styles.statLbl}>{s.desc}</Text>
              </View>
            ))}
          </LinearGradient>
        </View>

        {/* About */}
        <View style={[styles.section, { marginTop: 28 }]}>
          <Card>
            <SectionHeader overline="Who we are" title={business.aboutTitle} />
            <Text style={[type.body, { color: colors.textMuted }]} numberOfLines={5}>{business.aboutText}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 14 }}>
              {(business.highlights || []).slice(0, 3).map((h) => (
                <View key={h} style={styles.hl}>
                  <Ionicons name="shield-checkmark" size={14} color={colors.blue} />
                  <Text style={styles.hlText}>{h}</Text>
                </View>
              ))}
            </View>
            <Button title="More About Us" variant="outline" small onPress={() => navigation.navigate('About')} style={{ marginTop: 8, alignSelf: 'flex-start' }} />
          </Card>
        </View>

        {/* Shutter types */}
        <View style={[styles.section, { marginTop: 28 }]}>
          <View style={styles.rowBetween}>
            <SectionHeader overline="Shutter types" title="Find the right shutter" style={{ flex: 1, marginBottom: 0 }} />
            <Pressable onPress={() => goToTab(navigation, 'Shutters')} hitSlop={10}>
              <Text style={styles.link}>See all</Text>
            </Pressable>
          </View>
          <View style={{ marginTop: 14 }}>
            {shutterTypes.slice(0, 4).map((t) => (
              <Card key={t.id} style={styles.typeRow} onPress={() => navigation.navigate('ShutterTypeDetail', { id: t.id })}>
                <SmartImage source={t.image} style={styles.typeImg} iconSize={22} />
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={[type.h3, { color: colors.navy, fontSize: 15.5 }]} numberOfLines={1}>{t.name}</Text>
                  <Text style={[type.small, { color: colors.textMuted, marginTop: 3 }]} numberOfLines={2}>{t.short}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
              </Card>
            ))}
          </View>
        </View>

        {/* Gallery preview */}
        {gallery.length ? (
          <View style={[styles.section, { marginTop: 18 }]}>
            <View style={styles.rowBetween}>
              <SectionHeader overline="Our work" title="Project Gallery" style={{ flex: 1, marginBottom: 0 }} />
              <Pressable onPress={() => navigation.navigate('Gallery')} hitSlop={10}>
                <Text style={styles.link}>View all</Text>
              </Pressable>
            </View>
            <View style={styles.galleryRow}>
              {gallery.slice(0, 3).map((g, i) => (
                <Pressable key={g.id} style={{ flex: 1, marginLeft: i ? 8 : 0 }} onPress={() => navigation.navigate('Gallery', { start: i })}>
                  <SmartImage source={g.image} style={styles.galleryImg} iconSize={22} />
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}

        {/* Testimonials */}
        {testimonials.length ? (
          <View style={{ marginTop: 28 }}>
            <View style={styles.section}>
              <SectionHeader overline="Client testimonials" title="What our clients say" />
            </View>
            <FlatList
              data={testimonials}
              horizontal
              keyExtractor={(t) => t.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: space.xl }}
              ItemSeparatorComponent={() => <View style={{ width: 14 }} />}
              renderItem={({ item }) => (
                <Card style={{ width: Math.min(320, width * 0.8) }}>
                  <Ionicons name="chatbox-ellipses" size={26} color={colors.blueLight} />
                  <Text style={[type.body, { color: colors.text, marginTop: 10, fontStyle: 'italic' }]}>{`"${item.text}"`}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14 }}>
                    <View style={styles.avatar}>
                      <Text style={{ color: colors.white, fontWeight: '800' }}>{(item.name || '?').charAt(0).toUpperCase()}</Text>
                    </View>
                    <View style={{ marginLeft: 10, flex: 1 }}>
                      <Text style={{ fontWeight: '800', color: colors.navy }}>{item.name}</Text>
                      <Text style={[type.small, { color: colors.textMuted }]} numberOfLines={1}>{item.role}</Text>
                    </View>
                  </View>
                </Card>
              )}
            />
          </View>
        ) : null}

        {/* CTA */}
        <View style={[styles.section, { marginTop: 28 }]}>
          <LinearGradient colors={[colors.navyDark, colors.navy]} style={styles.cta}>
            <IconBadge name="construct" bg="rgba(255,255,255,0.12)" color={colors.white} />
            <Text style={[type.h2, { color: colors.white, marginTop: 14 }]}>Looking for a custom project?</Text>
            <Text style={[type.body, { color: 'rgba(255,255,255,0.75)', marginTop: 6 }]}>
              We specialize in custom dimensions and specific security requirements for warehouses, shops, and homes.
            </Text>
            <Button title="Request a Free Quote" icon="document-text" variant="white" onPress={() => goToQuote(navigation)} style={{ marginTop: 18 }} />
          </LinearGradient>
        </View>
      </ScrollView>
      <WhatsAppFab />
    </View>
  );
}


const styles = StyleSheet.create({
  section: { paddingHorizontal: space.xl },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 34 },
  callPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 9 },
  callPillText: { color: colors.navy, fontWeight: '800', marginLeft: 6, fontSize: 13.5 },
  badge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6, marginBottom: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' },
  badgeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.blueLight, marginRight: 8 },
  badgeText: { color: colors.white, fontSize: 11.5, fontWeight: '800', letterSpacing: 1.3, textTransform: 'uppercase' },
  heroTitle: { color: colors.white, fontSize: 34, lineHeight: 40, fontWeight: '900', letterSpacing: -0.6 },
  heroText: { color: 'rgba(255,255,255,0.8)', fontSize: 15.5, lineHeight: 23, marginTop: 12 },
  yearsBox: { marginTop: 22, alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' },
  yearsNum: { color: colors.white, fontSize: 20, fontWeight: '900' },
  yearsLbl: { color: 'rgba(255,255,255,0.7)', fontSize: 12.5, fontWeight: '600' },
  quickWrap: { flexDirection: 'row', marginHorizontal: space.xl, marginTop: -26, backgroundColor: colors.white, borderRadius: radius.lg, paddingVertical: 14, borderWidth: 1, borderColor: colors.border, shadowColor: '#0F2C4C', shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 6, marginBottom: 30 },
  quickItem: { flex: 1, alignItems: 'center' },
  quickIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { marginTop: 7, fontSize: 12.5, fontWeight: '700', color: colors.navy },
  rowBetween: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  more: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  moreText: { color: colors.blue, fontWeight: '800', marginRight: 6, fontSize: 13.5 },
  statsBox: { borderRadius: radius.xl, padding: 18, flexDirection: 'row', flexWrap: 'wrap' },
  stat: { width: '50%', paddingVertical: 12, alignItems: 'center' },
  statNum: { color: colors.white, fontSize: 30, fontWeight: '900' },
  statLbl: { color: 'rgba(255,255,255,0.75)', fontSize: 11.5, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginTop: 2, textAlign: 'center' },
  hl: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.blueTint, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 6, marginRight: 8, marginBottom: 8 },
  hlText: { marginLeft: 5, color: colors.navy, fontWeight: '700', fontSize: 12.5 },
  link: { color: colors.blue, fontWeight: '800', fontSize: 14 },
  typeRow: { flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 10 },
  typeImg: { width: 64, height: 64, borderRadius: radius.md },
  galleryRow: { flexDirection: 'row', marginTop: 14 },
  galleryImg: { height: 110, borderRadius: radius.md },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' },
  cta: { borderRadius: radius.xl, padding: 22 },
});
