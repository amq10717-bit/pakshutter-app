import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, space, type } from '../theme';

export function Button({ title, onPress, icon, variant = 'primary', loading, disabled, style, small }) {
  const v = variants[variant] || variants.primary;
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [
        styles.btn,
        small && styles.btnSmall,
        { backgroundColor: v.bg, borderColor: v.border },
        pressed && !isDisabled && { opacity: 0.85, transform: [{ scale: 0.985 }] },
        isDisabled && { opacity: 0.55 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={small ? 16 : 19} color={v.fg} style={{ marginRight: 8 }} /> : null}
          <Text style={[styles.btnText, small && { fontSize: 14 }, { color: v.fg }]} numberOfLines={1}>
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const variants = {
  primary: { bg: colors.blue, fg: colors.white, border: colors.blue },
  navy: { bg: colors.navy, fg: colors.white, border: colors.navy },
  white: { bg: colors.white, fg: colors.navy, border: colors.white },
  outline: { bg: 'transparent', fg: colors.navy, border: colors.border },
  outlineLight: { bg: 'transparent', fg: colors.white, border: 'rgba(255,255,255,0.55)' },
  whatsapp: { bg: colors.whatsapp, fg: colors.white, border: colors.whatsapp },
  danger: { bg: colors.dangerTint, fg: colors.danger, border: colors.dangerTint },
};

export function Card({ children, style, onPress }) {
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }, style]}>
        {children}
      </Pressable>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionHeader({ overline, title, subtitle, light, style }) {
  return (
    <View style={[{ marginBottom: space.lg }, style]}>
      {overline ? <Text style={[type.overline, { color: light ? colors.blueLight : colors.blue, marginBottom: 6 }]}>{overline}</Text> : null}
      {title ? <Text style={[type.h2, { color: light ? colors.white : colors.navy }]}>{title}</Text> : null}
      {subtitle ? (
        <Text style={[type.body, { color: light ? 'rgba(255,255,255,0.75)' : colors.textMuted, marginTop: 6 }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

export function Chip({ label, selected, onPress, icon }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      style={[styles.chip, selected && styles.chipOn]}
    >
      {icon ? <Ionicons name={icon} size={14} color={selected ? colors.white : colors.navy} style={{ marginRight: 6 }} /> : null}
      <Text style={[styles.chipText, selected && { color: colors.white }]}>{label}</Text>
    </Pressable>
  );
}

export function Field({ label, required, error, hint, style, inputStyle, multiline, ...props }) {
  return (
    <View style={[{ marginBottom: space.lg }, style]}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {required ? <Text style={{ color: colors.danger }}> *</Text> : null}
        </Text>
      ) : null}
      <TextInput
        placeholderTextColor={colors.textLight}
        style={[styles.input, multiline && styles.inputMulti, error && { borderColor: colors.danger }, inputStyle]}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

export function IconBadge({ name, size = 22, bg = colors.blueTint, color = colors.blue, box = 46 }) {
  return (
    <View style={{ width: box, height: box, borderRadius: radius.md, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name={name} size={size} color={color} />
    </View>
  );
}

export function Loading({ label }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <ActivityIndicator size="large" color={colors.blue} />
      {label ? <Text style={{ marginTop: 12, color: colors.textMuted }}>{label}</Text> : null}
    </View>
  );
}

export function EmptyState({ icon = 'albums-outline', title, text, action }) {
  return (
    <View style={{ alignItems: 'center', padding: 32 }}>
      <Ionicons name={icon} size={46} color={colors.textLight} />
      <Text style={[type.h3, { color: colors.navy, marginTop: 12, textAlign: 'center' }]}>{title}</Text>
      {text ? <Text style={[type.body, { color: colors.textMuted, textAlign: 'center', marginTop: 6 }]}>{text}</Text> : null}
      {action ? <View style={{ marginTop: 16 }}>{action}</View> : null}
    </View>
  );
}

export function Bullet({ text, light, icon = 'checkmark-circle' }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
      <Ionicons name={icon} size={19} color={light ? colors.blueLight : colors.blue} style={{ marginTop: 1, marginRight: 10 }} />
      <Text style={[type.body, { flex: 1, color: light ? colors.white : colors.text }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    minHeight: 50,
    paddingHorizontal: 20,
    borderRadius: radius.md,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSmall: { minHeight: 40, paddingHorizontal: 14, borderRadius: radius.sm },
  btnText: { fontSize: 15.5, fontWeight: '700' },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: space.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginRight: 8,
    marginBottom: 8,
  },
  chipOn: { backgroundColor: colors.navy, borderColor: colors.navy },
  chipText: { fontSize: 13.5, fontWeight: '600', color: colors.navy },
  label: { fontSize: 14, fontWeight: '700', color: colors.navy, marginBottom: 7 },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15.5,
    color: colors.text,
    minHeight: 50,
  },
  inputMulti: { minHeight: 110, paddingTop: 12 },
  error: { color: colors.danger, fontSize: 12.5, marginTop: 5, fontWeight: '600' },
  hint: { color: colors.textLight, fontSize: 12.5, marginTop: 5 },
});
