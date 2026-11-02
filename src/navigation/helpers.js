export function goToQuote(navigation, params = {}) {
  navigation.navigate('MainTabs', { screen: 'Quote', params: { ...params, _t: Date.now() } });
}

export function goToTab(navigation, screen) {
  navigation.navigate('MainTabs', { screen });
}
