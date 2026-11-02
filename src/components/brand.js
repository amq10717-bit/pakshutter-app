import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, shadow } from '../theme';
import { callPhone, openWhatsApp } from '../lib/contact';
import { useData } from '../context/DataContext';

const mark = require('../../assets/logo-mark.png');

export function Logo({ size = 40, light = true, onLongPress }) {
  const { business } = useData();
  return (
    <Pressable onLongPress={onLongPress} delayLongPress={1200} style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={[styles.markBox, { width: size, height: size, borderRadius: size * 0.25 }]}>
        <Image source={mark} style={{ width: size * 0.82, height: size * 0.82 }} resizeMode="contain" />
      </View>
      <View style={{ marginLeft: 10 }}>
        <Text style={[styles.name, { color: light ? colors.white : colors.navy }]}>{(business.name || 'Pak Shutter').toUpperCase()}</Text>
        <Text style={[styles.sub, { color: light ? 'rgba(255,255,255,0.65)' : colors.textMuted }]}>
          {(business.subtitle || 'Metal Works').toUpperCase()}
        </Text>
      </View>
    </Pressable>
  );
}

/** Large WhatsApp button floating above the tab bar */
export function WhatsAppFab({ message }) {
  const { business } = useData();
  return (
    <Pressable
      accessibilityLabel="Chat on WhatsApp"
      onPress={() => openWhatsApp(business.whatsapp, message || `Assalam o Alaikum ${business.name}, I need information about shutters.`)}
      style={({ pressed }) => [styles.fab, pressed && { transform: [{ scale: 0.94 }] }]}
    >
      <Ionicons name="logo-whatsapp" size={30} color={colors.white} />
    </Pressable>
  );
}

/** Sticky Call + WhatsApp bar at the bottom of detail screens */
export function ContactBar({ message, quoteLabel, onQuote }) {
  const { business } = useData();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <Pressable style={[styles.barBtn, { backgroundColor: colors.blueTint }]} onPress={() => callPhone(business.phone)} accessibilityLabel="Call">
        <Ionicons name="call" size={20} color={colors.blue} />
      </Pressable>
      <Pressable
        style={[styles.barBtn, { backgroundColor: colors.whatsapp }]}
        onPress={() => openWhatsApp(business.whatsapp, message)}
        accessibilityLabel="WhatsApp"
      >
        <Ionicons name="logo-whatsapp" size={22} color={colors.white} />
      </Pressable>
      <Pressable style={[styles.barQuote]} onPress={onQuote} accessibilityRole="button">
        <Ionicons name="document-text" size={18} color={colors.white} style={{ marginRight: 8 }} />
        <Text style={styles.barQuoteText} numberOfLines={1}>
          {quoteLabel || 'Get A Quote'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  markBox: { backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },
  sub: { fontSize: 9.5, fontWeight: '700', letterSpacing: 2.2, marginTop: 1 },
  fab: {
    position: 'absolute',
    right: 18,
    bottom: 18,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.whatsapp,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow,
    shadowOpacity: 0.25,
    elevation: 8,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  barBtn: { width: 52, height: 50, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  barQuote: {
    flex: 1,
    height: 50,
    borderRadius: radius.md,
    backgroundColor: colors.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  barQuoteText: { color: colors.white, fontWeight: '700', fontSize: 15.5 },
});
