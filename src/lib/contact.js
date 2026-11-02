import { Alert, Linking, Platform } from 'react-native';

const digits = (s) => String(s || '').replace(/[^\d+]/g, '');

export function waNumber(n) {
  let d = String(n || '').replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  if (d.startsWith('0')) d = '92' + d.slice(1);
  return d;
}

async function open(url, fallback, failMsg) {
  try {
    await Linking.openURL(url);
  } catch (e) {
    if (fallback) {
      try {
        await Linking.openURL(fallback);
        return;
      } catch (_) {}
    }
    Alert.alert('Could not open', failMsg || 'Please try again.');
  }
}

export function callPhone(phone) {
  const p = digits(phone);
  return open(`tel:${p}`, null, `Please call us on ${phone}`);
}

export function openWhatsApp(number, message = '') {
  const n = waNumber(number);
  const text = encodeURIComponent(message);
  const app = `whatsapp://send?phone=${n}${message ? `&text=${text}` : ''}`;
  const web = `https://wa.me/${n}${message ? `?text=${text}` : ''}`;
  if (Platform.OS === 'web') return open(web);
  return open(app, web, `WhatsApp us on +${n}`);
}

export function sendEmail(email, subject = '', body = '') {
  const q = [];
  if (subject) q.push(`subject=${encodeURIComponent(subject)}`);
  if (body) q.push(`body=${encodeURIComponent(body)}`);
  return open(`mailto:${email}${q.length ? `?${q.join('&')}` : ''}`, null, `Email us at ${email}`);
}

export function openMap(query) {
  const q = encodeURIComponent(query);
  const geo = Platform.OS === 'android' ? `geo:0,0?q=${q}` : null;
  const web = `https://www.google.com/maps/search/?api=1&query=${q}`;
  if (geo) return open(geo, web);
  return open(web);
}

export function openUrl(url) {
  if (!url) return null;
  return open(url, null, url);
}
