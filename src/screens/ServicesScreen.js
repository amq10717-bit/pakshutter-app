import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useData } from '../context/DataContext';
import SmartImage from '../components/SmartImage';
import { Button, Card, IconBadge, SectionHeader } from '../components/ui';
import { WhatsAppFab } from '../components/brand';
import { goToQuote } from '../navigation/helpers';
import { ionOr } from '../lib/icons';
import { colors, radius, space, type } from '../theme';

export default function ServicesScreen({ navigation }) {
  const { services } = useData();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <FlatList
        data={services}
        keyExtractor={(s) => s.id}
        contentContainerStyle={{ padding: space.xl, paddingBottom: 110 }}
        ListHeaderComponent={
          <SectionHeader
            overline="What we offer"
            title="Premium Shutter & Metal Works"
            subtitle="Whether it's a new installation or an emergency repair, our expert team is equipped to handle all your industrial needs."
          />
        }
        renderItem={({ item }) => (
          <Card style={styles.card} onPress={() => navigation.navigate('ServiceDetail', { id: item.id })}>
            <SmartImage source={item.image} style={styles.img} icon={ionOr(item.icon)}>
              <View style={styles.iconFloat}>
                <IconBadge name={ionOr(item.icon)} bg={colors.white} color={colors.blue} box={44} />
              </View>
            </SmartImage>
            <View style={{ padding: 16 }}>
              <Text style={[type.h3, { color: colors.navy, fontSize: 18 }]}>{item.title}</Text>
              <Text style={[type.body, { color: colors.textMuted, marginTop: 6 }]}>{item.short}</Text>
              <View style={styles.row}>
                <View style={styles.more}>
                  <Text style={styles.moreText}>Discover More</Text>
                  <Ionicons name="arrow-forward" size={15} color={colors.blue} />
                </View>
                <Button small title="Get Quote" variant="navy" onPress={() => goToQuote(navigation, { service: item.title })} />
              </View>
            </View>
          </Card>
        )}
        ListFooterComponent={
          <Card style={{ backgroundColor: colors.navy, borderColor: colors.navy }}>
            <Text style={[type.h3, { color: colors.white }]}>Looking for a custom project?</Text>
            <Text style={[type.body, { color: 'rgba(255,255,255,0.75)', marginTop: 6 }]}>
              We specialize in custom dimensions and specific security requirements for warehouses, shops, and homes.
            </Text>
            <Button title="Contact With Us" variant="white" style={{ marginTop: 14 }} onPress={() => goToQuote(navigation, { service: 'Custom Metal Works' })} />
          </Card>
        }
      />
      <WhatsAppFab />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 0, marginBottom: 18 },
  img: { height: 170, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg },
  iconFloat: { position: 'absolute', left: 14, bottom: 14 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
  more: { flexDirection: 'row', alignItems: 'center' },
  moreText: { color: colors.blue, fontWeight: '800', marginRight: 6 },
});
