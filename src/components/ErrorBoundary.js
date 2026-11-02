import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors } from '../theme';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.warn('App error', error, info && info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30, backgroundColor: colors.bg }}>
        <Text style={{ fontSize: 20, fontWeight: '800', color: colors.navy, textAlign: 'center' }}>Something went wrong</Text>
        <Text style={{ color: colors.textMuted, textAlign: 'center', marginTop: 8 }}>Please try again. If the problem continues, restart the app.</Text>
        <Pressable onPress={() => this.setState({ error: null })} style={{ marginTop: 20, backgroundColor: colors.blue, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }}>
          <Text style={{ color: colors.white, fontWeight: '700' }}>Try Again</Text>
        </Pressable>
      </View>
    );
  }
}
