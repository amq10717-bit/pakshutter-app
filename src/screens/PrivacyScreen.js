import React from 'react';
import { ScrollView, Text } from 'react-native';
import { useData } from '../context/DataContext';
import { colors, space, type } from '../theme';

function H({ children }) {
  return <Text style={[type.h3, { color: colors.navy, marginTop: 20, marginBottom: 6 }]}>{children}</Text>;
}
function P({ children }) {
  return <Text style={[type.body, { color: colors.text }]}>{children}</Text>;
}

export default function PrivacyScreen() {
  const { business } = useData();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: space.xl, paddingBottom: 40 }}>
      <Text style={[type.h2, { color: colors.navy }]}>Privacy Policy</Text>
      <P>This policy explains how the {business.name} app handles your information.</P>
      <H>Information we collect</H>
      <P>
        When you submit a quotation request we collect the details you enter: your name, phone number, address, and optionally your email,
        shutter requirement, size and message. We do not collect your location, contacts, or any other data from your phone.
      </P>
      <H>How we use it</H>
      <P>
        Your details are used only by {business.name} to contact you about your request, give you a quotation and provide our services.
        We never sell or share your information with anyone else for marketing.
      </P>
      <H>Storage</H>
      <P>
        {'Requests are stored securely in Google Firebase and can only be read by '}
        {business.name}
        {" staff. Your name, phone and address are also saved on your own phone so you don't have to type them again. If you choose WhatsApp, your message is sent through WhatsApp under its own privacy policy."}
      </P>
      <H>Deleting your data</H>
      <P>
        To have your request deleted, contact us on {business.phone} or {business.email} and we will remove it.
      </P>
      <H>Contact</H>
      <P>
        {business.name}, {business.address}. Phone: {business.phone}. Email: {business.email}.
      </P>
    </ScrollView>
  );
}
