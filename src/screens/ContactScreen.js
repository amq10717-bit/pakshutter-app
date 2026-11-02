import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import Constants from 'expo-constants';
import { useData } from '../context/DataContext';
import { Button, Card, IconBadge, SectionHeader } from '../components/ui';
import { Logo } from '../components/brand';
import { callPhone, openMap, openUrl, openWhatsApp, sendEmail, waNumber } from '../lib/contact';
import { goToQuote } from '../navigation/helpers';
import { colors, radius, space, type } from '../theme';

export default function ContactScreen({ navigation }) {
  const { business } = useData();
  const [copied, setCopied] = useState('');

  const copy = async (label, value) => {
    try {
      await Clipboard.setStringAsync(value);
      setCopied(label);
      setTimeout(() => setCopied(''), 1600);
    } catch (e) {}
  };

  const rows = [
    { icon: 'call', title: 'Make a Call', value: business.phone, onPress: () => callPhone(business.phone), copy: business.phone },
    { icon: 'logo-whatsapp', title: 'WhatsApp', value: `+${waNumber(business.whatsapp)}`, onPress: () => openWhatsApp(business.whatsapp, `Assalam o Alaikum ${business.name},`), color: colors.whatsapp, bg: '#E7F9EE' },
    { icon: 'mail', title: 'Send Email', value: business.email, onPress: () => sendEmail(business.email, `Inquiry - ${business.name}`), copy: business.email },
    { icon: 'location', title: 'Visit our Office', value: business.address, onPress: () => openMap(business.mapQuery || business.address), copy: business.address },
    business.hours ? { icon: 'time', title: 'Working Hours', value: business.hours } : null,
    business.facebook ? { icon: 'logo-facebook', title: 'Facebook', value: 'Follow us on Facebook', onPress: () => openUrl(business.facebook), color: '#1877F2', bg: '#E8F1FE' } : null,
    business.website ? { icon: 'globe', title: 'Website', value: business.website.replace(/^https?:\/\//, ''), onPress: () => openUrl(business.website) } : null,
  ].filter(Boolean);

  const version = (Constants.expoConfig && Constants.expoConfig.version) || '1.0.0';

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: space.xl, paddingBottom: 40 }}>
      <SectionHeader overline="Get in touch" title="We provide the best metal works for you." subtitle="Ready to upgrade your security? Contact us for installation, repair, or a custom quote. We are available 24/7." />

      <View style={{ flexDirection: 'row', marginBottom: 16 }}>
        <Button title="Call Now" icon="call" variant="navy" style={{ flex: 1, marginRight: 10 }} onPress={() => callPhone(business.phone)} />
        <Button title="WhatsApp" icon="logo-whatsapp" variant="whatsapp" style={{ flex: 1 }} onPress={() => openWhatsApp(business.whatsapp, `Assalam o Alaikum ${business.name},`)} />
      </View>

      <Card style={{ padding: 6 }}>
        {rows.map((r, i) => (
          <Pressable
            key={r.title}
            onPress={r.onPress}
            onLongPress={r.copy ? () => copy(r.title, r.copy) : undefined}
            disabled={!r.onPress && !r.copy}
            style={({ pressed }) => [styles.row, i < rows.length - 1 && styles.rowBorder, pressed && { backgroundColor: colors.bg }]}
          >
            <IconBadge name={r.icon} color={r.color || colors.blue} bg={r.bg || colors.blueTint} box={44} size={21} />
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.rowTitle}>{r.title}</Text>
              <Text style={styles.rowValue}>{copied === r.title ? 'Copied ✓' : r.value}</Text>
            </View>
            {r.onPress ? <Ionicons name="chevron-forward" size={18} color={colors.textLight} /> : null}
          </Pressable>
        ))}
      </Card>
      <Text style={styles.tip}>Tip: long-press phone, email or address to copy.</Text>

      <Card style={{ marginTop: 18, backgroundColor: colors.navy, borderColor: colors.navy }}>
        <Text style={[type.h3, { color: colors.white }]}>Need a price?</Text>
        <Text style={[type.body, { color: 'rgba(255,255,255,0.75)', marginTop: 4 }]}>Send us your requirement and get a free quotation.</Text>
        <Button title="Get A Quote" icon="document-text" variant="white" style={{ marginTop: 14 }} onPress={() => goToQuote(navigation)} />
      </Card>

      <View style={styles.links}>
        <Pressable style={styles.link} onPress={() => navigation.navigate('About')}>
          <Ionicons name="information-circle-outline" size={20} color={colors.navy} />
          <Text style={styles.linkText}>About Us</Text>
        </Pressable>
        <Pressable style={styles.link} onPress={() => navigation.navigate('Privacy')}>
          <Ionicons name="shield-outline" size={20} color={colors.navy} />
          <Text style={styles.linkText}>Privacy Policy</Text>
        </Pressable>
        <Pressable style={styles.link} onPress={() => navigation.navigate('AdminLogin')}>
          <Ionicons name="lock-closed-outline" size={20} color={colors.navy} />
          <Text style={styles.linkText}>Admin</Text>
        </Pressable>
      </View>

      <View style={{ alignItems: 'center', marginTop: 26 }}>
        <Logo light={false} size={36} />
        <Text style={[type.small, { color: colors.textMuted, textAlign: 'center', marginTop: 10 }]}>{business.footerText}</Text>
        <Text style={[type.small, { color: colors.textLight, marginTop: 6 }]}>
          © {new Date().getFullYear()} {business.name} · v{version}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: radius.md },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rowTitle: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  rowValue: { fontSize: 15.5, fontWeight: '700', color: colors.navy, marginTop: 2 },
  tip: { color: colors.textLight, fontSize: 12.5, marginTop: 8, textAlign: 'center' },
  links: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 22 },
  link: { alignItems: 'center', padding: 8 },
  linkText: { color: colors.navy, fontWeight: '600', marginTop: 4, fontSize: 13 },
});
