import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePreventRemove } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useData } from '../context/DataContext';
import SmartImage from '../components/SmartImage';
import { Button, Card, Field } from '../components/ui';
import { pickAndUploadImage } from '../lib/media';
import { SERVICE_ICONS } from '../lib/icons';
import { SCHEMAS } from './schemas';
import { deleteItem, friendlyError, saveBusiness, saveItem } from './adminApi';
import { withAdmin } from './AdminGate';
import { colors, radius, space } from '../theme';

function emptyFor(field) {
  if (field.type === 'list' || field.type === 'pairs') return [];
  return '';
}

function ImageField({ value, onChange }) {
  const [busy, setBusy] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
  const pick = async () => {
    setBusy(true);
    try {
      const ref = await pickAndUploadImage();
      if (ref) onChange(ref);
    } catch (e) {
      Alert.alert(
        'Could not add photo',
        e && e.message === 'permission' ? 'Please allow photo access for this app in your phone settings.' : friendlyError(e),
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <View>
      <SmartImage source={value} style={styles.imgPreview} icon="image-outline" />
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <Button small title={value ? 'Change photo' : 'Choose photo'} icon="image" variant="navy" loading={busy} onPress={pick} style={{ flex: 1, marginRight: 8 }} />
        {value ? <Button small title="Remove" icon="trash" variant="danger" onPress={() => onChange('')} /> : null}
      </View>
      <Text onPress={() => setShowUrl((s) => !s)} style={styles.urlToggle}>
        {showUrl ? 'Hide image link' : 'Or use an image link (URL)'}
      </Text>
      {showUrl ? (
        <TextInput
          value={value && !String(value).startsWith('media:') ? value : ''}
          onChangeText={onChange}
          placeholder="https://…"
          autoCapitalize="none"
          keyboardType="url"
          style={styles.smallInput}
          placeholderTextColor={colors.textLight}
        />
      ) : null}
    </View>
  );
}

function ListField({ value, onChange }) {
  const list = Array.isArray(value) ? value : [];
  const update = (i, v) => onChange(list.map((x, j) => (j === i ? v : x)));
  return (
    <View>
      {list.map((item, i) => (
        <View key={i} style={styles.listRow}>
          <TextInput value={item} onChangeText={(v) => update(i, v)} style={[styles.smallInput, { flex: 1, marginTop: 0 }]} placeholder={`Item ${i + 1}`} placeholderTextColor={colors.textLight} multiline />
          <Pressable onPress={() => onChange(list.filter((_, j) => j !== i))} hitSlop={8} style={styles.rm}>
            <Ionicons name="close-circle" size={24} color={colors.danger} />
          </Pressable>
        </View>
      ))}
      <Button small title="Add item" icon="add" variant="outline" onPress={() => onChange([...list, ''])} style={{ alignSelf: 'flex-start' }} />
    </View>
  );
}

function PairsField({ value, onChange, labels = ['Title', 'Description'] }) {
  const list = Array.isArray(value) ? value : [];
  const update = (i, k, v) => onChange(list.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  return (
    <View>
      {list.map((item, i) => (
        <View key={i} style={styles.pair}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontWeight: '800', color: colors.textMuted }}>#{i + 1}</Text>
            <Pressable onPress={() => onChange(list.filter((_, j) => j !== i))} hitSlop={8}>
              <Ionicons name="trash-outline" size={20} color={colors.danger} />
            </Pressable>
          </View>
          <TextInput value={item.title} onChangeText={(v) => update(i, 'title', v)} placeholder={labels[0]} style={styles.smallInput} placeholderTextColor={colors.textLight} />
          <TextInput value={item.desc} onChangeText={(v) => update(i, 'desc', v)} placeholder={labels[1]} style={styles.smallInput} placeholderTextColor={colors.textLight} multiline />
        </View>
      ))}
      <Button small title="Add" icon="add" variant="outline" onPress={() => onChange([...list, { title: '', desc: '' }])} style={{ alignSelf: 'flex-start' }} />
    </View>
  );
}

function IconField({ value, onChange }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {SERVICE_ICONS.map((n) => (
        <Pressable key={n} onPress={() => onChange(n)} style={[styles.iconOpt, value === n && styles.iconOn]} accessibilityLabel={n}>
          <Ionicons name={n} size={22} color={value === n ? colors.white : colors.navy} />
        </Pressable>
      ))}
    </View>
  );
}

function AdminEditScreen({ route, navigation }) {
  const { kind, id } = route.params;
  const schema = SCHEMAS[kind];
  const data = useData();
  const insets = useSafeAreaInsets();
  const isBusiness = kind === 'business';

  const original = useMemo(() => {
    if (isBusiness) return data.business;
    if (id) return (data[kind] || []).find((x) => x.id === id) || {};
    const max = (data[kind] || []).reduce((m, x) => Math.max(m, Number(x.order) || 0), 0);
    return { order: max + 1 };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [form, setForm] = useState(() => {
    const f = {};
    schema.fields.forEach((fd) => {
      const v = original[fd.key];
      f[fd.key] = v === undefined || v === null ? emptyFor(fd) : fd.type === 'number' ? String(v) : v;
    });
    return f;
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const dirty = useRef(false);
  const [isDirty, setIsDirty] = useState(false);
  const allowLeave = useRef(false);

  const set = (k) => (v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (!dirty.current) {
      dirty.current = true;
      setIsDirty(true);
    }
    if (errors[k]) setErrors((e) => ({ ...e, [k]: null }));
  };

  useLayoutEffect(() => {
    navigation.setOptions({ title: isBusiness ? schema.label : `${id ? 'Edit' : 'Add'} ${schema.singular}` });
  }, [navigation, schema, id, isBusiness]);

  usePreventRemove(isDirty && !saving, ({ data: ev }) => {
    if (allowLeave.current) {
      navigation.dispatch(ev.action);
      return;
    }
    Alert.alert('Discard changes?', 'You have unsaved changes.', [
      { text: 'Keep editing', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: () => navigation.dispatch(ev.action) },
    ]);
  });

  const leave = () => {
    allowLeave.current = true;
    dirty.current = false;
    setIsDirty(false);
    setTimeout(() => navigation.goBack(), 0);
  };

  const save = async () => {
    const e = {};
    const out = {};
    schema.fields.forEach((fd) => {
      let v = form[fd.key];
      if (fd.type === 'number') {
        const n = Number(String(v).trim());
        v = String(v).trim() === '' || Number.isNaN(n) ? 0 : n;
      } else if (fd.type === 'list') {
        v = (v || []).map((s) => String(s).trim()).filter(Boolean);
      } else if (fd.type === 'pairs') {
        v = (v || []).map((p) => ({ title: String(p.title || '').trim(), desc: String(p.desc || '').trim() })).filter((p) => p.title || p.desc);
      } else {
        v = String(v || '').trim();
      }
      if (fd.required && (v === '' || (Array.isArray(v) && !v.length))) e[fd.key] = 'Required';
      out[fd.key] = v;
    });
    if (isBusiness && out.whatsapp) out.whatsapp = out.whatsapp.replace(/\D/g, '').replace(/^0(?=3)/, '92');
    setErrors(e);
    if (Object.keys(e).length) {
      Alert.alert('Missing information', 'Please fill in the required fields marked in red.');
      return;
    }
    setSaving(true);
    try {
      if (isBusiness) await saveBusiness(out);
      else await saveItem(kind, id, out);
      leave();
    } catch (err) {
      Alert.alert('Could not save', friendlyError(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = () => {
    if ((data[kind] || []).length <= 1) {
      Alert.alert('Cannot delete', 'At least one item must remain. Add another item first.');
      return;
    }
    Alert.alert(`Delete ${schema.singular}?`, 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setSaving(true);
          try {
            await deleteItem(kind, id);
            leave();
          } catch (err) {
            Alert.alert('Could not delete', friendlyError(err));
          } finally {
            setSaving(false);
          }
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: space.xl, paddingBottom: 30 }} keyboardShouldPersistTaps="handled">
        {schema.fields.map((fd) => {
          const label = (
            <Text style={styles.label}>
              {fd.label}
              {fd.required ? <Text style={{ color: colors.danger }}> *</Text> : null}
            </Text>
          );
          if (['text', 'multiline', 'number'].includes(fd.type)) {
            return (
              <Field
                key={fd.key}
                label={fd.label}
                required={fd.required}
                value={String(form[fd.key] ?? '')}
                onChangeText={set(fd.key)}
                multiline={fd.type === 'multiline'}
                keyboardType={fd.type === 'number' ? 'number-pad' : fd.keyboardType || 'default'}
                autoCapitalize={fd.keyboardType === 'email-address' || fd.keyboardType === 'url' ? 'none' : 'sentences'}
                placeholder={fd.placeholder}
                error={errors[fd.key]}
              />
            );
          }
          return (
            <Card key={fd.key} style={[{ marginBottom: 16, padding: 14 }, errors[fd.key] && { borderColor: colors.danger }]}>
              {label}
              {fd.type === 'image' ? <ImageField value={form[fd.key]} onChange={set(fd.key)} /> : null}
              {fd.type === 'list' ? <ListField value={form[fd.key]} onChange={set(fd.key)} /> : null}
              {fd.type === 'pairs' ? <PairsField value={form[fd.key]} onChange={set(fd.key)} labels={fd.pairLabels} /> : null}
              {fd.type === 'icon' ? <IconField value={form[fd.key]} onChange={set(fd.key)} /> : null}
              {errors[fd.key] ? <Text style={{ color: colors.danger, fontWeight: '600', marginTop: 6 }}>{errors[fd.key]}</Text> : null}
            </Card>
          );
        })}
        {!isBusiness && id ? <Button title={`Delete ${schema.singular}`} icon="trash" variant="danger" onPress={remove} disabled={saving} /> : null}
      </ScrollView>
      <View style={[styles.saveBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Button title="Save Changes" icon="checkmark" loading={saving} onPress={save} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, fontWeight: '700', color: colors.navy, marginBottom: 10 },
  imgPreview: { height: 170, borderRadius: radius.md },
  urlToggle: { color: colors.blue, fontWeight: '700', marginTop: 10, fontSize: 13 },
  smallInput: { borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: colors.text, backgroundColor: colors.white, marginTop: 8 },
  listRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  rm: { marginLeft: 8 },
  pair: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 10, marginBottom: 10, backgroundColor: colors.bg },
  iconOpt: { width: 48, height: 48, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginRight: 8, marginBottom: 8, backgroundColor: colors.white },
  iconOn: { backgroundColor: colors.navy, borderColor: colors.navy },
  saveBar: { paddingHorizontal: space.xl, paddingTop: 12, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border },
});

export default withAdmin(AdminEditScreen);
