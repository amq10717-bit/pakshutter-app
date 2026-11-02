import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { DataProvider } from './src/context/DataContext';
import { AuthProvider } from './src/context/AuthContext';
import ErrorBoundary from './src/components/ErrorBoundary';
import { colors } from './src/theme';

import HomeScreen from './src/screens/HomeScreen';
import ServicesScreen from './src/screens/ServicesScreen';
import ServiceDetailScreen from './src/screens/ServiceDetailScreen';
import ShutterTypesScreen from './src/screens/ShutterTypesScreen';
import ShutterTypeDetailScreen from './src/screens/ShutterTypeDetailScreen';
import GalleryScreen from './src/screens/GalleryScreen';
import QuoteScreen from './src/screens/QuoteScreen';
import ContactScreen from './src/screens/ContactScreen';
import AboutScreen from './src/screens/AboutScreen';
import PrivacyScreen from './src/screens/PrivacyScreen';

import AdminLoginScreen from './src/admin/AdminLoginScreen';
import AdminHomeScreen from './src/admin/AdminHomeScreen';
import AdminListScreen from './src/admin/AdminListScreen';
import AdminEditScreen from './src/admin/AdminEditScreen';
import AdminInquiriesScreen from './src/admin/AdminInquiriesScreen';
import AdminInquiryScreen from './src/admin/AdminInquiryScreen';

SplashScreen.preventAutoHideAsync().catch(() => {});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, primary: colors.blue, background: colors.bg, card: colors.white, text: colors.navy, border: colors.border },
};

const headerStyle = {
  headerStyle: { backgroundColor: colors.navy },
  headerTintColor: colors.white,
  headerTitleStyle: { fontWeight: '800' },
  headerShadowVisible: false,
};

const TAB_ICONS = {
  Home: ['home', 'home-outline'],
  Services: ['construct', 'construct-outline'],
  Shutters: ['albums', 'albums-outline'],
  Quote: ['document-text', 'document-text-outline'],
  Contact: ['call', 'call-outline'],
};

function MainTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...headerStyle,
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.textLight,
        tabBarLabelStyle: { fontSize: 11.5, fontWeight: '700' },
        tabBarStyle: { height: 66 + insets.bottom, paddingTop: 6, paddingBottom: Math.max(insets.bottom, 10), borderTopColor: colors.border },
        tabBarIcon: ({ focused, color }) => <Ionicons name={TAB_ICONS[route.name][focused ? 0 : 1]} size={23} color={color} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Services" component={ServicesScreen} options={{ title: 'Our Services', tabBarLabel: 'Services' }} />
      <Tab.Screen name="Shutters" component={ShutterTypesScreen} options={{ title: 'Shutter Types', tabBarLabel: 'Shutters' }} />
      <Tab.Screen name="Quote" component={QuoteScreen} options={{ title: 'Get A Quote', tabBarLabel: 'Quote' }} />
      <Tab.Screen name="Contact" component={ContactScreen} options={{ title: 'Contact Us', tabBarLabel: 'Contact' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Content is bundled, so the app can start immediately
    const t = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(t);
  }, []);

  const onLayout = useCallback(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <DataProvider>
          <AuthProvider>
            <View style={{ flex: 1 }} onLayout={onLayout}>
              <NavigationContainer theme={navTheme}>
                <StatusBar style="light" />
                <Stack.Navigator screenOptions={{ ...headerStyle, contentStyle: { backgroundColor: colors.bg } }}>
                  <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false, title: 'Home' }} />
                  <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} options={{ title: 'Service' }} />
                  <Stack.Screen name="ShutterTypeDetail" component={ShutterTypeDetailScreen} options={{ title: 'Shutter Type' }} />
                  <Stack.Screen name="Gallery" component={GalleryScreen} options={{ title: 'Photo Gallery' }} />
                  <Stack.Screen name="About" component={AboutScreen} options={{ title: 'About Us' }} />
                  <Stack.Screen name="Privacy" component={PrivacyScreen} options={{ title: 'Privacy Policy' }} />
                  <Stack.Screen name="AdminLogin" component={AdminLoginScreen} options={{ title: 'Admin' }} />
                  <Stack.Screen name="AdminHome" component={AdminHomeScreen} options={{ title: 'Admin Panel' }} />
                  <Stack.Screen name="AdminList" component={AdminListScreen} />
                  <Stack.Screen name="AdminEdit" component={AdminEditScreen} />
                  <Stack.Screen name="AdminInquiries" component={AdminInquiriesScreen} options={{ title: 'Quote Requests' }} />
                  <Stack.Screen name="AdminInquiry" component={AdminInquiryScreen} options={{ title: 'Request Details' }} />
                </Stack.Navigator>
              </NavigationContainer>
            </View>
          </AuthProvider>
        </DataProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
