import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { authErrorMessage, useAuth } from '../context/AuthContext';
import { isFirebaseConfigured } from '../lib/firebase';
import { Button, Card, Field } from '../components/ui';
import { colors, space, type } from '../theme';

export default function AdminLoginScreen({ navigation }) {
  const { isAdmin, login, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isAdmin) navigation.replace('AdminHome');
  }, [isAdmin, navigation]);

  if (!isFirebaseConfigured) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, padding: space.xl, justifyContent: 'center' }}>
        <Card style={{ alignItems: 'center' }}>
          <Ionicons name="cloud-offline-outline" size={46} color={colors.warning} />
          <Text style={[type.h3, { color: colors.navy, marginTop: 12, textAlign: 'center' }]}>Admin panel not connected</Text>
          <Text style={[type.body, { color: colors.textMuted, textAlign: 'center', marginTop: 6 }]}>
            Firebase has not been set up for this build yet. Follow the setup guide to connect the database, then rebuild the app.
          </Text>
        </Card>
      </View>
    );
  }

  const submit = async () => {
    setError('');
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setBusy(true);
    try {
      await login(email, password); // the effect above opens the admin panel
    } catch (e) {
      setError(authErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const forgot = async () => {
    if (!email.trim()) {
      setError('Enter your email above first, then tap "Forgot password".');
      return;
    }
    try {
      await resetPassword(email);
      Alert.alert('Email sent', 'Check your inbox for a link to reset your password.');
    } catch (e) {
      setError(authErrorMessage(e));
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: space.xl, flexGrow: 1, justifyContent: 'center' }} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: 'center', marginBottom: 22 }}>
          <View style={{ width: 70, height: 70, borderRadius: 35, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="lock-closed" size={30} color={colors.white} />
          </View>
          <Text style={[type.h2, { color: colors.navy, marginTop: 14 }]}>Admin Login</Text>
          <Text style={[type.body, { color: colors.textMuted, marginTop: 4, textAlign: 'center' }]}>Manage services, photos, business details and quote requests.</Text>
        </View>
        <Card>
          <Field label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" placeholder="admin@example.com" />
          <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry={!show} autoCapitalize="none" placeholder="••••••••" onSubmitEditing={submit} />
          <Text onPress={() => setShow((s) => !s)} style={{ color: colors.blue, fontWeight: '700', marginTop: -8, marginBottom: 14 }}>
            {show ? 'Hide password' : 'Show password'}
          </Text>
          {error ? <Text style={{ color: colors.danger, fontWeight: '600', marginBottom: 12 }}>{error}</Text> : null}
          <Button title="Login" icon="log-in" loading={busy} onPress={submit} />
          <Text onPress={forgot} style={{ color: colors.textMuted, textAlign: 'center', marginTop: 16, fontWeight: '600' }}>
            Forgot password?
          </Text>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
